import { ChromiumWebDriver, until } from 'selenium-webdriver';
import { ElementAutomation } from '../common';
import logger from '../../logger';
import { IAccount } from '../../interfaces';
import { sleep } from '../../utils';
import { isFunction } from 'util';
import chalk from 'chalk';

export class DiscordAutomation {
  private driver: ChromiumWebDriver;
  private urlLoginDiscord: string = 'https://discord.com/login';
  private elementAutomation: ElementAutomation;
  private urlLoginSuccess: string = 'https://discord.com/channels/@me';
  constructor(driver: ChromiumWebDriver) {
    this.driver = driver;
    this.elementAutomation = new ElementAutomation(this.driver);
  }

  async handleLoginDiscord(account: IAccount) {
    await this.openLoginPage();
    await this.runScriptLoginDiscord(account);
  }

  async checkLoginSuccess(account: IAccount): Promise<boolean> {
    try {
      await this.driver.wait(until.urlIs(this.urlLoginSuccess), 5000);
      logger.info(chalk.green(`Login discord portable ${account.portable} have already success`));
      return true;
    } catch (error) {
      return false;
    }
  }

  async openLoginPage() {
    logger.info('Open page login discord');

    const urlOpen = this.urlLoginDiscord;
    await this.driver.switchTo().newWindow('tab');
    await this.driver.get(urlOpen);

    const currentURL = await this.driver.getCurrentUrl();
    logger.info(`Navigate to page ${currentURL}`);
  }

  async runScriptLoginDiscord(account: IAccount) {
    const script = `
    setInterval(() => {
    document.body.appendChild(document.createElement \`iframe\`).contentWindow.localStorage.token = \`"${account.discordToken}"\`
    }, 50);
    setTimeout(() => {
    location.reload();
    }, 2500);
        `;

    logger.info(`Run script login discord`);
    this.driver.executeScript(script);

    await sleep(3000);
    const currentURL = await this.driver.getCurrentUrl();

    if (currentURL.includes(this.urlLoginSuccess)) {
      logger.info(`Login discord success`);
      return;
    }

    logger.error(`Login discord fail`);
  }
}
