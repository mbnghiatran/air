import time
import logging
logger = logging.getLogger(__name__)

from selenium.webdriver import Chrome
from selenium.common.exceptions import *
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver import ChromeOptions
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.support import expected_conditions as EC

from ..emulator import SeleniumEmulator

def default_method_decorator(default_method):
    def decorator(method):
        def wrapped(self, *args, **kwargs):
            default_method(self)
            return method(self, *args, **kwargs)
        return wrapped
    return decorator

class Base_task:
    def __init__(self, emulator:SeleniumEmulator, user_data:dict):
        self.user_data = user_data
        self.emulator = emulator
        if self.emulator.get_current_url() not in ["chrome://new-tab-page/", "about:blank", "data:,"]:
            self.emulator.open_new_tab()
        self.task_tab = self.emulator.driver.current_window_handle

    def default_method(self):
        if self.emulator.driver.current_window_handle != self.task_tab:
            self.emulator.driver.switch_to.window(self.task_tab)

    @property
    def driver(self):
        return self.emulator.driver