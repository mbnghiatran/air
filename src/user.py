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
        self.emulator = SeleniumEmulator(selenium_config)
        extension_list = self.emulator.extension_list
        for extension in extension_list:
            if self.tasks.get(extension) is None:
                self.tasks[extension] = task_name[extension](self.emulator,
                                                              self.info, IExtension.get(extension))

    def add_task(self, tasks):
        for task in tasks:
            if self.tasks.get(task) is None:
                self.tasks[task] = task_name[task](self.emulator, self.info)
        return

    def quit(self):
        self.emulator.quit()


class Config:
    def __init__(self, yaml_path):
        with open(yaml_path, 'r') as yaml_file:
            yaml_content = yaml.safe_load(yaml_file)
        for key in yaml_content:
            setattr(self, key, yaml_content.get(key))