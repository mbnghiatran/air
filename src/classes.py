import yaml
import pandas as pd
from enum import Enum
from .emulator import SeleniumEmulator
from .task.dcom import DcomAutomation
from .task.gmail import Gmail
from .task.twitter import Twitter
from .task.metamask import MetaMask

task_name = {
    "dcom": DcomAutomation,
    "gmail": Gmail,
    "twitter": Twitter,
    "MetaMask": MetaMask,
}

class User:
    def __init__(self, user_info:dict, chrome_portable_exe_path:str='', headless=True):
        self.info = user_info
        self.chrome_portable_exe_path = chrome_portable_exe_path
        self.emulator = SeleniumEmulator(chrome_portable_exe_path, headless)
        self.tasks = {}

    def add_task(self, name):
        self.tasks[name] = task_name[name](self.emulator, self.info)


class Config:
    def __init__(self, yaml_path):
        with open(yaml_path, 'r') as yaml_file:
            yaml_content = yaml.safe_load(yaml_file)
        for key in yaml_content:
            setattr(self, key, yaml_content.get(key))