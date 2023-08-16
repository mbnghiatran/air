import yaml
import pandas as pd
from enum import Enum
from .emulator import SeleniumEmulator
from .constant import IExtension
from .task.gmail import Gmail
from .task.twitter import Twitter
from .task.metamask import MetaMask
from .task.dcom import DcomAutomation

task_name = {
    "dcom": DcomAutomation,
    "gmail": Gmail,
    "twitter": Twitter,
    "metamask": MetaMask,
}

class User:
    def __init__(self, user_info:dict={}, selenium_config:dict={}):
        self.tasks = {}
        self.info = user_info
        self.emulator = SeleniumEmulator(portable_path = user_info.get('portable_path'), config=selenium_config)

    def add_task(self, tasks):
        for task in tasks:
            if self.tasks.get(task) is None:
                task_info = {
                    "extension_detail": IExtension.get(task)
                }
                self.tasks[task] = task_name[task](self.emulator, self.info, task_info)
        return

    def quit(self):
        self.emulator.quit()


class Config:
    def __init__(self, yaml_path):
        with open(yaml_path, 'r') as yaml_file:
            yaml_content = yaml.safe_load(yaml_file)
        for key in yaml_content:
            setattr(self, key, yaml_content.get(key))