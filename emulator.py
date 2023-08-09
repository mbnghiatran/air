from copy import deepcopy
from selenium.webdriver import Chrome
from selenium.common.exceptions import *
from selenium.webdriver.common.by import By
from selenium.webdriver import ChromeOptions
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.service import Service as ChromeService
from config import Config, User

class SeleniumEmulator:
    def __init__(self, user: User, headless=True, **kwargs):
        self.user = user
        chrome_options = ChromeOptions()
        if headless:
            chrome_options.add_argument('--headless=new')
        if user.chrome_portable_exe_path:
            chrome_options.binary_location = user.chrome_portable_exe_path

        self.driver = Chrome(options = chrome_options)
        self.actions = ActionChains(self.driver)
        self.driver.implicitly_wait(3)
        self.INIT_SCRIPT = open("./default.js", 'r').read()

    def quit(self, ):
        self.driver.quit()

    def goto_url(self, url:str, delay:float=3.0):
        self.driver.get(url)

    def get_current_url(self):
        current_url = ''
        try: 
            current_url = self.driver.current_url
        except Exception as e:
            print(f'get current url exception: {e.msg}')
        finally:
            return current_url
    
        