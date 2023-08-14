import time
import logging
logger = logging.getLogger(__name__)
from tkinter import Tk

from selenium.webdriver import Chrome, ChromeOptions
from selenium.common.exceptions import *
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.service import Service as ChromeService

class SeleniumEmulator:
    def __init__(self, config:dict = {}, **kwargs):
        chrome_options = ChromeOptions()
        chrome_options.add_argument('start-maximized')
        chrome_options.add_argument('enable-automation')
        chrome_options.add_argument('disable-infobars')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--disable-dev-shm-usage')
        portable_path = config.get("portable_path")
        if portable_path:
            chrome_options.add_argument(f"--user-data-dir={str((portable_path / 'Data/profile').resolve())}")
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
        try:
            self.driver.get(url)
            time.sleep(delay)
        except:
            pass
        
    def get_current_url(self):
        return self.driver.current_url
    
    def send_keys(self, element, text):
        element.clear()
        element.send_keys(text)

    def get_text_from_clipboard(self):
        return Tk().clipboard_get()
        