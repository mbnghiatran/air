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
from .base import Base_task, default_method_decorator


class DcomAutomation(Base_task):
    def __init__(self, emulator:SeleniumEmulator, user_data:dict):
        super(DcomAutomation, self).__init__(emulator, user_data)
        self.home_url = ''
        self.emulator.goto_url(self.home_url)
    
    @default_method_decorator(Base_task.default_method)
    def click_connect_button(self):
        button = self.emulator.find_element(By.ID, "h_connect_btn")
        button.click()
        