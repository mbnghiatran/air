import time
import logging
logger = logging.getLogger(__name__)

from copy import deepcopy
from selenium.webdriver import Chrome, ChromeOptions
from selenium.common.exceptions import *
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.service import Service as ChromeService

class SeleniumEmulator:
    def __init__(self, config, **kwargs):
        chrome_options = ChromeOptions()
        chrome_options.add_argument('start-maximized')
        chrome_options.add_argument('enable-automation')
        chrome_options.add_argument('disable-infobars')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--disable-dev-shm-usage')
        if config.get("headless"):
            portable_path = config.get("portable_path")
            executable_path = config.get("executable_path")
            chrome_options.binary_location = str(portable_path / 'App/Chrome-bin/chrome.exe')
            chrome_options.binary_location = str(portable_path / 'GoogleChromePortable.exe')
            chrome_options.add_argument("--user-data-dir=" + f"{str(portable_path / 'Data/profile')}")
            chrome_options.add_argument("--remote-debugging-port=9222")
            service = ChromeService(executable_path= str(executable_path))
            self.driver = Chrome(service=service, options=chrome_options)
        else:
            self.driver = Chrome(options=chrome_options)
        self.actions = ActionChains(self.driver)
        self.driver.implicitly_wait(5.0)
        self.driver.set_page_load_timeout(10.0)
        self.INIT_SCRIPT = open("./src/default.js", 'r').read()

    def quit(self, ):
        self.driver.quit()

    def find_element(self, by:callable, value:str):
        try:
            # element =  WebDriverWait(self.driver, waiting_time).until(EC.visibility_of_element_located((by, value)))
            element =  self.driver.find_element(by, value)
            return element
        except:
            return None
    
    def open_new_tab(self):
        self.driver.switch_to.new_window('tab')

    def goto_url(self, url:str, delay:float=3.0):
        self.driver.get(url)
        time.sleep(delay)

    def get_current_url(self):
        return self.driver.current_url
    
    def send_keys(self, element, text):
        element.clear()
        element.send_keys(text)
        