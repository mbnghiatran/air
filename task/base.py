import time
import logging
logger = logging.getLogger(__name__)

from emulator import SeleniumEmulator
from selenium.webdriver import Chrome
from selenium.common.exceptions import *
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver import ChromeOptions
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.support import expected_conditions as EC



class Base_task:
    def __init__(self, emulator:SeleniumEmulator):
        self.emulator = emulator
        self.emulator.open_new_tab()
        self.main_tab = self.emulator.driver.current_window_handle