import os, signal
import time
from pathlib import Path
import argparse
from multiprocessing import Pool
from concurrent.futures import ThreadPoolExecutor, as_completed, ProcessPoolExecutor

from src.user import User, Config
from src.general import get_all_user, filter_user, read_yaml_file


def handler(signum, frame):
    print("sigint handler")
    os.kill(os.getpid(), signal.SIGKILL)
signal.signal(signal.SIGINT, handler)

def parser():
    parser = argparse.ArgumentParser(description='NA')
    parser.add_argument('--config', type=str, default='./data/config.yaml', help='config file')
    args = parser.parse_args()
    return args

def run_once(user_info, config):
    is_finished = False
    try: 
        user = User(user_info, config)
        user.add_task(config.task.keys())
        user.run()
        user.quit()
        is_finished = True
    except Exception as e:
        print(e)
    finally:
        return {user_info['STT']: is_finished}

def init_main_user(user_info, config):
    main_user = User(user_info, config)
    main_user.add_task(['dcom'])
    return main_user

def change_ip(main_user):
    return
    main_user.tasks['dcom'].click_connect_button()

if __name__ == '__main__':
    args = parser()
    config = Config(args.config)
    all_user_info = get_all_user(config.excel_file_path)
    all_user_info = filter_user(all_user_info, config.chrome_portable_exe_paths)
    main_user = None
    if config.dcom_url:
        main_user = init_main_user(all_user_info[0], config)
        all_user_info = all_user_info[1:]
    for i in range(0, len(all_user_info), config.user_per_group):
        with ProcessPoolExecutor(max_workers=1) as executor:
            # Submit tasks to the executor
            future_to_task = [executor.submit(run_once, user_info, config) for user_info in all_user_info[i : (i+config.user_per_group)]]
            is_finished = [future.result() for future in as_completed(future_to_task)]
        if main_user:
            change_ip(main_user)
    if main_user:
        main_user.quit()
    print(is_finished)