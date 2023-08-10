import { ChromiumWebDriver } from 'selenium-webdriver';
import CONFIG from '../../config';
import { ElementAutomation } from '../common';
import { IBy } from '../../interfaces';
import { EElementType } from '../../constant';

export class DcomAutomation {
  private driver: ChromiumWebDriver;
  private homePageDCOM: string;
  private elementAutomation: ElementAutomation;

  constructor(driver: ChromiumWebDriver) {
    this.driver = driver;
    this.homePageDCOM = CONFIG.dcomPage;
    this.elementAutomation = new ElementAutomation(this.driver);
  }

  async openPageDcom() {
    const urlOpen = this.homePageDCOM;
    await this.driver.switchTo().newWindow('tab');
    await this.driver.get(urlOpen);
  }

  async clickButtonConnect() {
    const ByButtonConnect: IBy = { type: EElementType.id, value: 'h_connect_btn' };
    await this.elementAutomation.waitElementLocated(ByButtonConnect);
    const element = await this.driver.findElement(this.elementAutomation.generateByElement(ByButtonConnect));
    await element.click();
  }
}
