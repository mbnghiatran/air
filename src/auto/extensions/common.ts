import { By, ChromiumWebDriver, until } from 'selenium-webdriver';
import { getPageExtension, stringToRegexPattern } from '../../utils';
import logger from '../../logger';
import { EExtensionName, TIME_WAITING } from '../../constant';
import { IExtension, IBy } from '../../interfaces';
import { ElementAutomation } from '../common';

export class CommonExtensionAutomation {
  private driver: ChromiumWebDriver;
  private elementAutomation: ElementAutomation;

  constructor(driver: ChromiumWebDriver) {
    this.driver = driver;
    this.elementAutomation = new ElementAutomation(this.driver);
  }

  async enterPassword(name: EExtensionName, inputPassword: IBy, password: string) {
    await this.elementAutomation.waitElementLocated(inputPassword);

    const passwordInput = await this.driver.findElement(this.elementAutomation.generateByElement(inputPassword));
    await passwordInput.clear(); // clear the existing value (if any)
    await passwordInput.sendKeys(password);
    logger.info(`Enter ${name} password ${password}`);
  }

  async clickButton(name: EExtensionName, button: IBy) {
    await this.elementAutomation.waitElementLocated(button);

    logger.info(`Click on ${name} button`);
    const buttonElement = await this.driver.findElement(this.elementAutomation.generateByElement(button));
    await buttonElement.click();
  }

  waitPageExist = async (url: string): Promise<void> => {
    logger.info(`Wait page exist ${url}`);
    await this.driver.wait(until.urlMatches(stringToRegexPattern(url)), 20000);
  };

  openExtensionPage = async (extensions: IExtension): Promise<void> => {
    const { id, page } = extensions;
    if (!page) return;

    const pageExtensionUrl = getPageExtension(id, page);

    await this.driver.get(pageExtensionUrl);

    return;
  };
}
