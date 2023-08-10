import { ChromiumWebDriver, until, By, ByHash, WebElement } from 'selenium-webdriver';
import { EElementType, TIME_WAITING } from '../../constant';
import { IBy } from '../../interfaces';

export class ElementAutomation {
  private driver: ChromiumWebDriver;

  constructor(driver: ChromiumWebDriver) {
    this.driver = driver;
  }

  generateByElement({ type, value }: IBy) {
    return { [type]: value } as ByHash;
  }

  async waitElementLocated(element: IBy): Promise<WebElement> {
    return await this.driver.wait(until.elementLocated(this.generateByElement(element)), TIME_WAITING.WAITING_ELEMENT_LOCATED);
  }
}
