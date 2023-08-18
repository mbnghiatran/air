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
    def __init__(self, emulator:SeleniumEmulator, user_data:dict, task_info:dict):
        super(MetaMask, self).__init__(emulator, user_data)
        self.extension_detail = task_info.get("extension_detail")
        self.password = "Mkmk1212!"
        self.open_page()
        if not self.is_wallet_created_before():
            self.id = self.create_new_wallet()

    @default_method_decorator(Base_task.default_method)
    def open_page(self):
        self.emulator.goto_url(self.get_page_extension())

    @default_method_decorator(Base_task.default_method)
    def is_wallet_created_before(self):
        try:
            WebDriverWait(self.driver, 10).until(EC.url_contains("#onboarding/welcome"))
            return False
        except:
            return True

    @default_method_decorator(Base_task.default_method)
    def create_new_wallet(self):
        checkbox_element = self.emulator.find_element(By.XPATH, "//input[@id='onboarding__terms-checkbox']")
        checkbox_element.click()

        create_btn = self.emulator.find_element(By.XPATH, "//button[@data-testid='onboarding-create-wallet']")
        create_btn.click()

        agree_btn = self.emulator.find_element(By.XPATH, "//button[@data-testid='metametrics-i-agree']")
        agree_btn.click()

        password = self.emulator.find_element(By.XPATH, "//input[@data-testid='create-password-new']")
        password.send_keys(self.password)

        confirm_password = self.emulator.find_element(By.XPATH, "//input[@data-testid='create-password-confirm']")
        confirm_password.send_keys(self.password)

        password_checkbox = self.emulator.find_element(By.XPATH, "//input[@data-testid='create-password-terms']")
        password_checkbox.click()

        create_wallet_btn = self.emulator.find_element(By.XPATH, "//button[@data-testid='create-password-wallet']")
        create_wallet_btn.click()

        remind_later_btn = self.emulator.find_element(By.XPATH, "//button[@data-testid='secure-wallet-later']")
        remind_later_btn.click()

        skip_security_checkbox = self.emulator.find_element(By.XPATH, "//input[@data-testid='skip-srp-backup-popover-checkbox']")
        skip_security_checkbox.click()

        skip_btn = self.emulator.find_element(By.XPATH, "//button[@data-testid='skip-srp-backup']")
        skip_btn.click()

        got_it_btn = self.emulator.find_element(By.XPATH, "//button[@data-testid='onboarding-complete-done']")
        got_it_btn.click()

        next_btn = self.emulator.find_element(By.XPATH, "//button[@data-testid='pin-extension-next']")
        next_btn.click()

        done_btn = self.emulator.find_element(By.XPATH, "//button[@data-testid='pin-extension-done']")
        done_btn.click()
        WebDriverWait(self.driver, 10).until(EC.url_contains(self.get_page_extension()))
        self.close_pop_over()
        return self.get_address_id()
    
    def get_address_id(self):
        copy_address_btn = self.emulator.find_element(By.XPATH, "//button[@data-testid='address-copy-button-text']")
        copy_address_btn.click()
        return self.emulator.get_text_from_clipboard()

    @default_method_decorator(Base_task.default_method)
    def close_pop_over(self):
        close_pop_over_button = self.emulator.find_element(By.XPATH, "//button[@data-testid='popover-close']")
        close_pop_over_button.click()

    @default_method_decorator(Base_task.default_method)
    def unlock_wall(self):
        WebDriverWait(self.driver, 10).until(EC.url_contains("#unlock"))
        input_password = self.emulator.find_element(By.XPATH, "//input[@id='password']")
        self.emulator.send_keys(input_password, self.defaultPassword)

        unlock_button = self.emulator.find_element(By.XPATH, "//button[@type='submit']")
        unlock_button.click()
        return
