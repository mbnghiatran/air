
import time
import logging
logger = logging.getLogger(__name__)
from tkinter import Tk

from pathlib import Path
from copy import deepcopy
from selenium.webdriver import Chrome, ChromeOptions
from selenium.common.exceptions import *
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.service import Service as ChromeService
from .constant import is_windows

class SeleniumEmulator:
    def __init__(self, portable_path = None, config:dict = {}, **kwargs):
        chrome_options = ChromeOptions()
        chrome_options.add_argument('start-maximized')
        chrome_options.add_argument('enable-automation')
        chrome_options.add_argument('disable-infobars')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--disable-dev-shm-usage')
        if portable_path and is_windows:
            portable_path = Path(portable_path)
            chrome_options.add_argument(f"--remote-debugging-port={portable_path.stem}")
            chrome_options.add_argument(f"--user-data-dir={str((portable_path / 'Data/profile').resolve())}")
        else:
            chrome_options.add_extension("./data/extension_crx/metamask_10.34.3_0.crx")
        self.driver = Chrome(options=chrome_options)
        time.sleep(3.0)
        self.actions = ActionChains(self.driver)
        self.driver.implicitly_wait(5.0)
        self.driver.set_page_load_timeout(10.0)
        self.INIT_SCRIPT = open("./src/default.js", 'r').read()
        self.original_window = self.driver.current_window_handle
        self.close_tab()

    def quit(self, ):
        self.driver.quit()

    def find_element(self, by:callable, value:str):
        try:
            element =  WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((by, value)))
            # element =  self.driver.find_element(by, value)
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
    
    def close_tab(self):
        try:
            handles = deepcopy(self.driver.window_handles)
            for handle in handles:
                if handle != self.original_window:
                    self.driver.switch_to.window(handle)
                    self.driver.close()
        except Exception as e:
            logger.warning(f'closing tabs exception: {e.msg}')
        finally:
            self.driver.switch_to.window(self.original_window)