import os
from pathlib import Path
import pandas as pd

def get_all_portable_exe_path(parent_path):
    if not parent_path:
        return []
    parent_path = Path(parent_path)
    all_exe = list(parent_path.rglob("*.exe"))
    return all_exe

def get_all_user(file_path):
    if Path(file_path).suffix == '.xlsx':
        file_path=xlxs2csv(file_path)
    df = pd.read_csv(file_path)
    return df.to_dict(orient='records')

def xlxs2csv(excel_file_path):
    output = excel_file_path[:-5] + ".csv"
    data_frame = pd.read_excel(excel_file_path)
    data_frame.to_csv(output, index=False)
    return output