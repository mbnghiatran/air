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

class MetaMask(Base_task):
    def __init__(self, emulator:SeleniumEmulator, user_data:dict):
        super(MetaMask, self).__init__(emulator, user_data)
        self.id = ''
        self.page = ''
        self.password = ''

    def close_pop_over(self):
        try:
            WebDriverWait(self.driver, 5).until(EC.url_contains("home.html"))
            close_pop_over_button = self.emulator.find_element(By.CSS_SELECTOR, "button[data-testid='popover-close']")
            close_pop_over_button.click()
        except:
            pass

    def create_new_wallet_out_signin(self):
        return
    
    def createNewWallet(self):
        return

    def handle_create_wallet_Metamask(self):
        self.open_page()
        if not self.is_wallet_created_before():
            self.createNewWalletOutSignIn()
        self.enter_password()
        self.close_pop_over()
        return

    def get_wallet_address_Metamask(self):
        self.open_page()
        self.enter_password()
        self.close_pop_over()
        copy_button = self.emulator.find_element(By.CLASS_NAME, "selected-account__clickable")
        copy_button.click()
        address = self.teget_text_from_clipboard()
        return address

    def open_page(self,):
        self.emulator.goto_url(self.get_page_extension())
        return
    
    def get_page_extension(self,):
        return f"chrome-extension://{self.id}/{self.page}"
    
    def enter_password(self):
        WebDriverWait(self.driver, 5).until(EC.url_contains("unlock"))
        input_password = self.emulator.find_element(By.ID, "password")
        self.emulator.send_keys(input_password, password = self.password)

        unlock_button = self.emulator.find_element(By.CSS_SELECTOR, "button[type='submit']")
        unlock_button.click()
        return

    def is_wallet_created_before(self):
        try:
            WebDriverWait(self.driver, 5).until(EC.url_contains("#initialize/welcome"))
            return False
        except:
            return True

    def login(self):
        return 

    def validate_unlock_success(self):
        element = self.emulator.find_element(By.ID, "password-helper-text")
        if element:
            logger.info("Incorrect password entered.")
        else:
            logger.info("Password entered successfully!")
            