import os
import platform

from pathlib import Path
import argparse
from src.classes import User
from src.general import get_all_user, filter_user
from multiprocessing import Process, Manager, Pool



def parser():
    parser = argparse.ArgumentParser(description='NA')
    parser.add_argument('--executable_path', default='D:\\nghia\\air\\data\\CHROME\\chromedriver.exe', help='executable_path')
    parser.add_argument('--chrome_portable_exe_paths', default='./data/CHROME', help='portable_path')
    parser.add_argument('--excel_file_path', default='./data/DataTest_Dat.csv', help='data file')
    parser.add_argument('--user_per_group', type=int, default=2, help='total training epochs')
    args = parser.parse_args()
    return args

def run_once(user_config):
    user = User(user_config.pop("user_info"), user_config)
    for task_name in ['twitter',]: 
        user.add_task(task_name)
    user.end_all()
    return {user.info['STT']: True}

def change_ip():
    return

if __name__ == '__main__':
    args = parser()
    all_user = get_all_user(args.excel_file_path)
    portable2profile = filter_user(all_user, args.chrome_portable_exe_paths)
    portable2profile = list(portable2profile.items())
    for i in range(0, len(portable2profile), args.user_per_group):
        list_user_config = [{
            "user_info": _[1],
            "headless": False,
            "portable_path": _[0],
            "executable_path": Path(args.executable_path),
        } for _ in portable2profile[i:(i+args.user_per_group)]]
        with Pool(processes=2) as pool:
            results = pool.imap_unordered(run_once, list_user_config)
            results = list(results)
        change_ip()
    print(results)