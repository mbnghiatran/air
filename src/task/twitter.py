import time
import logging
logger = logging.getLogger(__name__)

from selenium.common.exceptions import *
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from ..emulator import SeleniumEmulator
from .base import Base_task, default_method_decorator

class Twitter(Base_task):
    def __init__(self, emulator:SeleniumEmulator, user_data:dict):
        super(Twitter, self).__init__(emulator, user_data)
        self.username = self.user_data.get("Twitter")
        self.password = self.user_data.get("Pass Twitter")
        self.url = "https://twitter.com/?lang=en"
        self.home_url = "https://twitter.com/home"
        self.emulator.goto_url(self.url)
        if not self.is_login_successful():
            self.login()

    @default_method_decorator(Base_task.default_method)
    def is_login_successful(self):
        current_url = self.emulator.get_current_url()
        if "/home" in current_url:
            return True
        return False
    
    @default_method_decorator(Base_task.default_method)
    def login(self):
        sign_in_element = self.emulator.find_element(By.CSS_SELECTOR, "a[data-testid='loginButton']")
        sign_in_element.click()
        # input username
        username_input = self.emulator.find_element(By.CSS_SELECTOR, "input[name='text'][type='text']")
        self.emulator.send_keys(username_input, self.username)
        time.sleep(0.5)

        # click next
        next_element = self.emulator.find_element(By.XPATH, "//span[text()='Next']")
        next_element.click()

        # input password
        password_input = self.emulator.find_element(By.CSS_SELECTOR, "input[name='password'][type='password']")
        self.emulator.send_keys(password_input, self.password)

        # submit
        login_element = self.emulator.find_element(By.XPATH, "//span[text()='Log in']")
        login_element.click()
        WebDriverWait(self.driver, 10).until(EC.url_contains(self.home_url))
        return

    @default_method_decorator(Base_task.default_method)
    def retweet(self, link):
        return
    
    @default_method_decorator(Base_task.default_method)
    def follow(self, link):
        return
    
    @default_method_decorator(Base_task.default_method)
    def like(self, link):
        return

