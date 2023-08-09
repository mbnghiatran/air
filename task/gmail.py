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
from .base import Base_task


class Gmail(Base_task):
    def __init__(self, emulator:SeleniumEmulator):
        super(Gmail, self).__init__(emulator)
        self.service_login_url = "https://accounts.google.com/ServiceLogin"
        self.interactive_login_url = "https://accounts.google.com/InteractiveLogin"
        self.my_account_url = "https://myaccount.google.com" #https://myaccount.google.com/?utm_source=sign_in_no_continue&pli=1
        self.emulator.goto_url(self.service_login_url, delay=5.0)
        if not self.is_login_successful():
            self.login()
            
    def is_login_successful(self):
        current_url = self.emulator.get_current_url()
        if self.my_account_url in current_url:
            return True
        return False
    
    def login(self):
        try:  ## Didn't login before
            # input email
            email_input = self.emulator.driver.find_element(By.XPATH, "//input[@type='email']")
            email_input.send_keys(self.emulator.user.data['gmail']['username'])
            # click next
            next_button = self.emulator.driver.find_element(By.ID, "identifierNext")
        except: ## Have login before
            next_button = self.emulator.driver.find_element(By.XPATH, "//button")

        finally:
            next_button.click()
            # input password
            password_input = self.emulator.driver.find_element(By.NAME, "Passwd")
            password_input.send_keys(self.emulator.user.data['gmail']['password'])
            # Submit the login form
            submit_button = self.emulator.driver.find_element((By.ID, 'passwordNext'))
            submit_button.click()
            WebDriverWait(self.emulator.driver, 10).until(EC.url_contains(self.my_account_url))