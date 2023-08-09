import yaml
import pandas as pd


class User:
    def __init__(self, data:dict, chrome_portable_exe_path:str=''):
        self.data = data
        self.chrome_portable_exe_path = chrome_portable_exe_path
        

class Config:
    def __init__(self, yaml_path):
        with open(yaml_path, 'r') as yaml_file:
            yaml_content = yaml.safe_load(yaml_file)
        for key in yaml_content:
            setattr(self, key, yaml_content.get(key))