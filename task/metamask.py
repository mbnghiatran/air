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
from .base import Base_task, default_method_decorator

class MetaMask(Base_task):
    def __init__(self, emulator:SeleniumEmulator):
        super(MetaMask, self).__init__(emulator)