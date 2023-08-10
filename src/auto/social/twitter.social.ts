import { By, ChromiumWebDriver, until } from 'selenium-webdriver';
import { EElementType, PAGE_LOGIN } from '../../constant';
import { IAccount, IBy } from '../../interfaces';
import CONFIG from '../../config';
import logger from '../../logger';
import { ElementAutomation } from '../common';
import chalk from 'chalk';

export class TwitterSocialAutomation {
  private driver: ChromiumWebDriver;
  private urlPageLogin: string = PAGE_LOGIN.twitter;
  private accountData: IAccount[] = [];
  private elementAutomation: ElementAutomation;

  constructor(driver: ChromiumWebDriver) {
    this.driver = driver;
    this.elementAutomation = new ElementAutomation(this.driver);
  }

  async checkLoginSuccess(account: IAccount): Promise<boolean> {
    try {
      await this.driver.wait(until.urlIs('https://twitter.com/home'), 5000);
      logger.info(chalk.green(`Login twitter ${account.twitter} at portable ${account.portable} have already success`));
      return true;
    } catch (error) {
      return false;
    }
  }

  // async extractData() {
  //   this.accountData = await extractFileData(CONFIG.twitterAccountData, ESocial.TWITTER);
  //   logger.info('Account data: ', this.accountData.length);
  // }

  findAccount(portableNumber: number): IAccount {
    const account = this.accountData.find((item) => item.portable === portableNumber);
    if (account === undefined) {
      throw new Error(`Account with portable number ${portableNumber} not found`);
    }
    return account;
  }

  async openLoginPage() {
    logger.info('Open page login twitter');

    const urlOpen = this.urlPageLogin;
    await this.driver.switchTo().newWindow('tab');
    await this.driver.get(urlOpen);
  }

  async loginTwitter(account: IAccount) {
    logger.info(`Account: ${account.portable} - ${account.twitter} - ${account.passTwitter} `);

    const ByInputUsername: IBy = { type: EElementType.name, value: 'text' };
    const ByButton: IBy = { type: EElementType.xpath, value: '//span[contains(text(), "Next")]' };

    const ByInputPassword: IBy = { type: EElementType.name, value: 'password' };
    const ByButtonLogin: IBy = { type: EElementType.xpath, value: "//span[contains(text(), 'Log in')]" };

    await this.elementAutomation.waitElementLocated(ByInputUsername);
    await this.elementAutomation.waitElementLocated(ByButton);

    // 1. Enter username
    const inputUsername = await this.driver.findElement(this.elementAutomation.generateByElement(ByInputUsername));
    await inputUsername.clear();
    await inputUsername.sendKeys(account.twitter);

    // 2. Click Next
    const buttonNext = await this.driver.findElement(this.elementAutomation.generateByElement(ByButton));
    const buttonNextElement = await buttonNext.findElement(By.xpath('../../..'));
    await buttonNextElement.click();

    //3. Enter password
    await this.elementAutomation.waitElementLocated(ByInputPassword);
    const inputPassword = await this.driver.findElement(this.elementAutomation.generateByElement(ByInputPassword));
    await inputPassword.clear();
    await inputPassword.sendKeys(account.passTwitter);

    //4. Enter Login
    const buttonLogin = await this.driver.findElement(this.elementAutomation.generateByElement(ByButtonLogin));
    const buttonLoginElement = await buttonLogin.findElement(By.xpath('../../..'));
    await buttonLoginElement.click();

    //5. Check login success
    await this.driver.wait(until.urlIs('https://twitter.com/home'), 5000);

    logger.info(`Login account ${account.twitter} - ${account.passTwitter} success`);
  }
}
