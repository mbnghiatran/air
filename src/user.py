import yaml
import pandas as pd
from enum import Enum
from .emulator import SeleniumEmulator
from .constant import IExtension
from .task import DcomAutomation, Gmail, Discord, Twitter, MetaMask

task_name = {
    "dcom": DcomAutomation,
    "gmail": Gmail,
    "twitter": Twitter,
    "metamask": MetaMask,
    "discord": Discord
}

class User:
    def __init__(self, user_info:dict={}, config:dict={}):
        self.tasks = {}
        self.info = user_info
        self.config = config
        self.emulator = SeleniumEmulator(portable_path = user_info.get('portable_path'), config=config)            

    def run(self):
        for task_name, task in self.tasks:
            task.run(self.config.task.get(task_name))
        return

    def add_task(self, tasks):
        for task in tasks:
            if self.tasks.get(task) is None:
                print(f"User {self.info['STT']}, Init {task}")
                task_info = {
                    "extension_detail": IExtension.get(task), 
                    "dcom_url": self.config.dcom_url, 
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