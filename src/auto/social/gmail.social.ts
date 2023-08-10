import { By, ChromiumWebDriver, until } from 'selenium-webdriver';
import { EElementType, PAGE_LOGIN } from '../../constant';
import { IAccount, IBy } from '../../interfaces';
import CONFIG from '../../config';
import logger from '../../logger';
import { ElementAutomation } from '../common';
import { THROW_ERROR_PROBLEM, sleep } from '../../utils';
import chalk from 'chalk';

export class GmailSocialAutomation {
  private driver: ChromiumWebDriver;
  private urlGoogle: string = 'https://www.google.com/intl/vi/gmail/about/';
  private myAccountUrl: string = 'https://myaccount.google.com/';
  private elementAutomation: ElementAutomation;

  constructor(driver: ChromiumWebDriver) {
    this.driver = driver;
    this.elementAutomation = new ElementAutomation(this.driver);
  }

  async checkLoginByGoToMyAccount(account: IAccount): Promise<boolean> {
    try {
      const urlOpen = this.myAccountUrl;
      await this.driver.switchTo().newWindow('tab');
      await this.driver.get(urlOpen);

      await sleep(2000);

      const currentURL = await this.driver.getCurrentUrl();

      if (currentURL.includes(this.myAccountUrl)) {
        logger.info(chalk.green(`Login ${account.email} gmail have already success`));
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async checkLoginSuccess(account: IAccount): Promise<boolean> {
    try {
      await this.driver.wait(until.urlContains('https://myaccount.google.com'), 5000);
      logger.info(`Login ${account.email} gmail have already success`);

      return true;
    } catch (error) {
      return false;
    }
  }

  async handleLoginGmail(account: IAccount) {
    await this.openLoginPage();
    await this.login(account);
  }

  async openLoginPage() {
    logger.info('Open page login twitter');

    const urlOpen = this.urlGoogle;
    await this.driver.switchTo().newWindow('tab');
    await this.driver.get(urlOpen);

    // Find Login Button
    const ByLoginButton: IBy = { type: EElementType.css, value: 'a[href*="accounts.google.com/AccountChooser"]' };
    await this.elementAutomation.waitElementLocated(ByLoginButton);
    const loginButton = await this.driver.findElement(this.elementAutomation.generateByElement(ByLoginButton));

    await sleep(2000);
    // Click Login Button
    await loginButton.click();

    // Check Page Have Change
    await this.driver.wait(until.urlContains('https://accounts.google.com/v3/signin'), 5000);

    const currentURL = await this.driver.getCurrentUrl();
    logger.info(`Navigate to page ${currentURL}`);
  }

  async login(account: IAccount) {
    const ByInputEmail: IBy = { type: EElementType.css, value: 'input[type="email"]' };
    const ByButton: IBy = { type: EElementType.xpath, value: '//span[contains(text(), "Tiếp theo")]' };
    const ByTextNotLogin: IBy = { type: EElementType.xpath, value: '//span[contains(text(), "Không thể đăng nhập cho bạn")]' };

    let loop = true;
    let count = 0;
    while (loop) {
      if (count === 3) THROW_ERROR_PROBLEM('Login Gmail Fail');

      // 1. Enter username
      await this.elementAutomation.waitElementLocated(ByInputEmail);

      const inputUsername = await this.driver.findElement(this.elementAutomation.generateByElement(ByInputEmail));
      await inputUsername.clear();
      await inputUsername.sendKeys(account.email);

      // 2. Click Next
      const buttonNext = await this.driver.findElement(this.elementAutomation.generateByElement(ByButton));
      const buttonNextElement = await buttonNext.findElement(By.xpath('..'));
      await buttonNextElement.click();

      // 3. Check login success
      try {
        ++count;
        const ByButtonTryAgain: IBy = { type: EElementType.css, value: 'a[href*="/restart?continue"]' };
        await this.elementAutomation.waitElementLocated(ByTextNotLogin);
        await this.elementAutomation.waitElementLocated(ByButtonTryAgain);
        const buttonTryAgain = await this.driver.findElement(this.elementAutomation.generateByElement(ByButtonTryAgain));
        await buttonTryAgain.click();

        // Check Page Have Change
        await this.driver.wait(until.urlContains('https://accounts.google.com/v3/signin'), 5000);
      } catch (error) {
        console.log(error);
        logger.info(`Login success`);
        loop = false;
      }
    }
  }
}
