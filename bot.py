import time
from pathlib import Path
import argparse
from multiprocessing import Pool

from src.classes import User
from src.general import get_all_user, filter_user

def parser():
    parser = argparse.ArgumentParser(description='NA')
    parser.add_argument('--chrome_portable_exe_paths', default='./data/CHROME', help='portable_path')
    parser.add_argument('--excel_file_path', default='./data/DataTest_Dat.csv', help='data file')
    parser.add_argument('--user_per_group', type=int, default=2, help='total training epochs')
    args = parser.parse_args()
    return args

def run_once(user_config, i):
    user = User(user_config.pop("user_info"), user_config)
    user.add_task(['twitter',])
    user.quit()
    return {user.info['STT']: (True, i)}

def init_main_user():
    user = User()
    user.add_task(['dcom', ])
    return user

def change_ip(user):
    return

if __name__ == '__main__':
    args = parser()
    # main_user = init_main_user()
    # time.sleep(5.0)
    # main_user.quit()
    all_user_info = get_all_user(args.excel_file_path)
    portable2profile = list(filter_user(all_user_info, args.chrome_portable_exe_paths).items())
    for i in range(0, len(portable2profile), args.user_per_group):
        list_user_config = [{
            "user_info": _[1],
            "headless": True,
            "portable_path": _[0],
        } for _ in portable2profile[i:(i+args.user_per_group)]]
        with Pool(processes=2) as pool:
            results = [pool.apply_async(run_once, args=(x,i)) for i, x in enumerate(list_user_config)]
            # Get and print the results
            is_finished = [_.get() for _ in results]
        # change_ip(user)
    print(is_finished)