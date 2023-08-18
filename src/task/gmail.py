import time
import logging
logger = logging.getLogger(__name__)

from selenium.common.exceptions import *
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from ..emulator import SeleniumEmulator
from .base import Base_task, default_method_decorator

class Gmail(Base_task):
    def __init__(self, emulator:SeleniumEmulator, user_data:dict, task_info:dict):
        super(Gmail, self).__init__(emulator, user_data)
        self.username = self.user_data.get("Mail")
        self.password = self.user_data.get("Pass Mail")
        self.service_login_url = "https://accounts.google.com/ServiceLogin"
        self.my_account_url = "https://myaccount.google.com"
        self.emulator.goto_url(self.service_login_url, delay=1.0)
        if not self.is_login_successful():
            self.login()

    @default_method_decorator(Base_task.default_method)      
    def is_login_successful(self):
        current_url = self.emulator.get_current_url()
        if self.my_account_url in current_url:
            return True
        return False
    
    @default_method_decorator(Base_task.default_method)
    def login(self):
        try: 
            account_element = self.emulator.find_element(By.XPATH, f"//div[@data-identifier='{self.username}']")
            if account_element: # have logged in before
                account_element.click()
            else:
                email_input = self.emulator.find_element(By.XPATH, "//input[@type='email']")
                if email_input:
                    self.emulator.send_keys(email_input, self.username)
                identifier_next = self.emulator.find_element(By.ID, "identifierNext")
                identifier_next.click()

            password_input = self.emulator.find_element(By.XPATH, "//input[@type='password']")
            self.emulator.send_keys(password_input, self.password)
            password_next = self.emulator.find_element(By.ID, "passwordNext")
            password_next.click()
            WebDriverWait(self.driver, 10).until(EC.url_contains(self.my_account_url))
        except:
            pass
        return