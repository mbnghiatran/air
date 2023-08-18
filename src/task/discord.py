import time
import logging
logger = logging.getLogger(__name__)

from selenium.common.exceptions import *
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from ..emulator import SeleniumEmulator
from .base import Base_task, default_method_decorator

class Discord(Base_task):
    def __init__(self, emulator:SeleniumEmulator, user_data:dict, task_info:dict):
        super(Discord, self).__init__(emulator, user_data)
        self.login_url = "https://discord.com/login"
        self.login_success_url = "https://discord.com/channels/@me"
        self.emulator.goto_url(self.login_success_url)
        self.discord_token = self.user_data.get("Token Discord")
        if not self.is_login_successful():
            self.login()

    @default_method_decorator(Base_task.default_method)
    def is_login_successful(self):
        current_url = self.emulator.get_current_url()
        if current_url.startswith(self.login_url):
            return False
        return True
    
    @default_method_decorator(Base_task.default_method)
    def login(self):
        self.driver.execute_script(self.emulator.INIT_SCRIPT + 'execute_script_with_token(arguments[0])', self.discord_token)
        WebDriverWait(self.driver, 10).until(EC.url_contains(self.login_success_url))
        return