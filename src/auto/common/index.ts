import { ChromiumWebDriver } from 'selenium-webdriver';
import { IExtension } from '../../interfaces';
import logger from '../../logger';
import { EExtensionName } from '../../constant';
import { EXTENSIONS } from '../../extensions';

export class CommonAutomation {
  private driver: ChromiumWebDriver;

  constructor(driver: ChromiumWebDriver) {
    this.driver = driver;
  }

  getInfoExtension(name: EExtensionName): IExtension {
    const extension = EXTENSIONS.find((item) => item.name === name);
    if (extension) {
      return extension;
    }
    throw new Error('Extension not found');
  }

  async navigateToTabMatchingUrl(urlMatch: string) {
    const windowHandles = await this.driver.getAllWindowHandles();

    for (let handle of windowHandles) {
      await this.driver.switchTo().window(handle);
      const currentUrl = await this.driver.getCurrentUrl();
      if (currentUrl.includes(urlMatch)) {
        logger.info(`Successfully navigated to ${urlMatch}.`);
        return;
      }
    }
    logger.error(`Failed to navigate to ${urlMatch}.`);
  }
}

export * from './element';
