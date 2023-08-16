import os, signal
import time
from pathlib import Path
import argparse
from multiprocessing import Pool
from concurrent.futures import ThreadPoolExecutor, as_completed

from src.user import User
from src.general import get_all_user, filter_user


def handler(signum, frame):
    print("sigint handler")
    os.kill(os.getpid(), signal.SIGKILL)
signal.signal(signal.SIGINT, handler)

def parser():
    parser = argparse.ArgumentParser(description='NA')
    parser.add_argument('--chrome_portable_exe_paths', default='./data/CHROME', help='portable_path')
    parser.add_argument('--excel_file_path', default='./data/DataTest_Dat.csv', help='data file')
    parser.add_argument('--user_per_group', type=int, default=2, help='total training epochs')
    args = parser.parse_args()
    return args

def run_once(user_info):
    selenium_config = {
        "headless": False
    }
    user = User(user_info, selenium_config)
    # user.add_task(['metamask'])
    user.quit()
    return {user.info['STT']: True}

def init_main_user():
    user = User()
    user.add_task(['dcom'])
    return user

def change_ip(main_user):
    return

if __name__ == '__main__':
    args = parser()
    # main_user = init_main_user()
    all_user_info = get_all_user(args.excel_file_path)
    all_user_info = filter_user(all_user_info, args.chrome_portable_exe_paths)
    for i in range(0, len(all_user_info), args.user_per_group):
        # user_info = all_user_info[i]
        # run_once(user_info)
        # break
        with ThreadPoolExecutor(max_workers=2) as executor:
            # Submit tasks to the executor
            future_to_task = [executor.submit(run_once, user_info) for user_info in all_user_info[i : (i+args.user_per_group)]]
            is_finished = [future.result() for future in as_completed(future_to_task)]
        # change_ip(main_user)
    print(is_finished)