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
    parser.add_argument('--chrome_portable_exe_paths', default='./data/CHROME', help='config')
    parser.add_argument('--excel_file_path', default='./data/DataTest_Dat.csv', help='config')
    args = parser.parse_args()
    return args

def run_once(user_info, portable_path, headless=True):
    if platform.system() == 'Darwin':
        portable_path = ''
    user = User(user_info, portable_path, headless)
    for task_name in ['gmail', 'twitter',]: 
        user.add_task(task_name)
    return


if __name__ == '__main__':
    args = parser()
    all_user = get_all_user(args.excel_file_path)
    user_data = filter_user(all_user, args.chrome_portable_exe_paths)
    for portable_path, info in user_data.items():
        run_once(info, portable_path, False)
        break

