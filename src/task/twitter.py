import time
import logging
logger = logging.getLogger(__name__)

from selenium.webdriver import Chrome
from selenium.common.exceptions import *
from selenium.webdriver.common.by import By
from selenium.webdriver import ChromeOptions
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.service import Service as ChromeService

from ..emulator import SeleniumEmulator
from .base import Base_task, default_method_decorator

class Twitter(Base_task):
    def __init__(self, emulator:SeleniumEmulator):
        super(Twitter, self).__init__(emulator)
        self.url = "https://twitter.com/"
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
        sign_in_element = self.emulator.driver.find_element(By.XPATH, "//span[text()='Sign in']")
        sign_in_element.click()
        time.sleep(3.0)
        # input username
        user_element = self.emulator.driver.find_element(By.NAME, "text")
        user_element.send_keys(self.emulator.user.data['Twitter'])
        # click next
        next_element = self.emulator.driver.find_element(By.XPATH, "//span[text()='Next']")
        next_element.click()
        time.sleep(1.0)
        # input password
        user_element = self.emulator.driver.find_element(By.NAME, "password")
        user_element.send_keys(self.emulator.user.data['Twitter'])
        # submit
        login_element = self.emulator.driver.find_element(By.XPATH, "//a[@role='button']") 
        login_element.click()
        time.sleep(3.0)

    @default_method_decorator(Base_task.default_method)
    def retweet(self):
        return
    
    @default_method_decorator(Base_task.default_method)
    def follow(self):
        return
    
    @default_method_decorator(Base_task.default_method)
    def like(self):
        return

