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
    def __init__(self, user_info:dict, selenium_config:dict={}):
        self.info = user_info
        self.emulator = SeleniumEmulator(selenium_config)
        self.tasks = {}

    def add_task(self, name):
        self.tasks[name] = task_name[name](self.emulator, self.info)

    def end_all(self):
        self.emulator.quit()


class Config:
    def __init__(self, yaml_path):
        with open(yaml_path, 'r') as yaml_file:
            yaml_content = yaml.safe_load(yaml_file)
        for key in yaml_content:
            setattr(self, key, yaml_content.get(key))