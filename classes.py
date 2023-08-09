import yaml
import pandas as pd
from emulator import SeleniumEmulator


class User:
    def __init__(self, user_info:dict, chrome_portable_exe_path:str='', headless=True):
        self.info = user_info
        self.chrome_portable_exe_path = chrome_portable_exe_path
        self.emulator = SeleniumEmulator(chrome_portable_exe_path, headless)
        self.tasks = []

    def add_task(self, task):
        self.tasks.append(task)
        
class Config:
    def __init__(self, yaml_path):
        with open(yaml_path, 'r') as yaml_file:
            yaml_content = yaml.safe_load(yaml_file)
        for key in yaml_content:
            setattr(self, key, yaml_content.get(key))