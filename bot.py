import os
import platform

from pathlib import Path
import argparse
from classes import Config, User
from emulator import SeleniumEmulator
from general import get_all_user
from task.twitter import Twitter
from task.gmail import Gmail


def parser():
    parser = argparse.ArgumentParser(description='NA')
    parser.add_argument('--chrome_portable_exe_paths', default='./data/CHROME', help='config')
    parser.add_argument('--excel_file_path', default='./data/DataTest_Dat.csv', help='config')
    args = parser.parse_args()
    return args

def run_once(user:User, headless=True):
    if platform.system() == 'Darwin':
        user.chrome_portable_exe_path = ''
    emulator = SeleniumEmulator(user, headless)
    gmail_task = Gmail(emulator)
    twitter_task = Twitter(emulator)
    emulator.quit()
    return


if __name__ == '__main__':
    args = parser()
    all_user = get_all_user(args.excel_file_path)
    users = []
    for row in all_user:
        portable_path = Path(args.chrome_portable_exe_paths) / str(row["STT"]) / "GoogleChromePortable.exe"
        if portable_path.exists():
            users.append(User(row, portable_path))
    for user in users:
        run_once(user, False)
        break

