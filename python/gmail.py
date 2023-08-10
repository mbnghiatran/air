from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

import time
import logging


from undetected_chromedriver       import Chrome
from selenium.webdriver.common.by  import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support    import expected_conditions as EC

import sys

# Get the command-line arguments
args = sys.argv

# Check if the email and password were provided
if len(args) < 5:
    logging.info("Please provide the following arguments:")
    logging.info("\n- email")
    logging.info("\n- password")
    logging.info("\n- profile path")
    logging.info("\n- chrome portable path")
    exit()

# Retrieve the email and password from the command-line arguments
email, password, profile_path, chrome_executable_path = args[1:5]

# Use the email and password in your script
logging.info("Logging in with email:", email, "and password:", password, "and profile path:", profile_path)

try:
    # driver_path = ChromeDriverManager(version="111.0.5563.64").install()
    service_login_url = "https://accounts.google.com/ServiceLogin"
    interactive_login_url = "https://accounts.google.com/InteractiveLogin"
    my_account_url = "https://myaccount.google.com" #https://myaccount.google.com/?utm_source=sign_in_no_continue&pli=1

    # create a WebDriver object using the ChromeOptions object
    driver = Chrome(use_subprocess=True, user_data_dir=profile_path, executable_path=chrome_executable_path)
    
    # navigate to a website
    driver.get(service_login_url)

    waiting_time = 10 # 10 seconds

    # Check the current URL
    current_url = driver.current_url
    
    login_successful = False
    
    if my_account_url in current_url:
        login_successful = True
    elif interactive_login_url in current_url:
        try:
            divHaveLoginBefore = WebDriverWait(driver, waiting_time).until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'div[data-identifier="hennettsasane50156@gmail.com"]')))
            divHaveLoginBefore.click()
            password_input = WebDriverWait(driver, waiting_time).until(EC.visibility_of_element_located((By.NAME, 'Passwd')))
            password_input.send_keys(password)

            # Submit the login form
            submit_button = WebDriverWait(driver, waiting_time).until(EC.visibility_of_element_located((By.ID, 'passwordNext')))
            submit_button.click()

            # Wait for the page to load
            WebDriverWait(driver, 10).until(EC.url_contains(my_account_url))

            # Return result
            login_successful = True
            
        except TimeoutException:
            # if the element is not found within the timeout, do something else
            raise MyError("Please reset portable chrome to original state")
    else:
        print("Login with email and password")
        # Fill in the login form
        email_input = WebDriverWait(driver, waiting_time).until(EC.visibility_of_element_located((By.NAME, 'identifier')))
        email_input.send_keys(email)

        next_button = WebDriverWait(driver, waiting_time).until(EC.visibility_of_element_located((By.ID, 'identifierNext')))
        next_button.click()

        password_input = WebDriverWait(driver, waiting_time).until(EC.visibility_of_element_located((By.NAME, 'Passwd')))
        password_input.send_keys(password)

        # Submit the login form
        submit_button = WebDriverWait(driver, waiting_time).until(EC.visibility_of_element_located((By.ID, 'passwordNext')))
        submit_button.click()

        # Wait for the page to load
        WebDriverWait(driver, 10).until(EC.url_contains(my_account_url))
        
        # Return result
        login_successful = True

    # Return result
    if login_successful:
        logging.info("Login successful")
        print('true')
    else:
        logging.warning("Login failed")
        print('false')
    
    driver.quit()


except Exception as e:
    # handle the error
    logging.error(f"An error occurred: {e}")
    # driver.quit()
    print('false')

# finally:
#     # close the browser window
#     if 'driver' in locals():
#         driver.close()