import os
import platform

from pathlib import Path
import argparse
from src.classes import Config, User
from src.general import get_all_user, filter_user
from src.task.twitter import Twitter
from src.task.gmail import Gmail


def parser():
    parser = argparse.ArgumentParser(description='NA')
    parser.add_argument('--executable_path', default='D:\\nghia\\air\\data\\CHROME\\chromedriver.exe', help='executable_path')
    parser.add_argument('--chrome_portable_exe_paths', default='./data/CHROME', help='portable_path')
    parser.add_argument('--excel_file_path', default='./data/DataTest_Dat.csv', help='data file')
    args = parser.parse_args()
    return args

def run_once(user_info, selenium_config):
    if platform.system() == 'Darwin':
        selenium_config = {}
    user = User(user_info, selenium_config)
    for task_name in ['twitter',]: 
        user.add_task(task_name)
        user.end_all()
    return


if __name__ == '__main__':
    args = parser()
    all_user = get_all_user(args.excel_file_path)
    portable2profile = filter_user(all_user, args.chrome_portable_exe_paths)
    for portable_path, profile in portable2profile.items():
        selenium_config = {
            "headless": True,
            "portable_path": portable_path,
            "executable_path": Path(args.executable_path),
        }
        run_once(profile, selenium_config)
        break

