import { By, ChromiumWebDriver } from 'selenium-webdriver';
import { CommonExtensionAutomation } from './common';
import { EElementType, EExtensionName } from '../../constant';
import logger from '../../logger';
import { getPageExtension } from '../../utils';
import { CommonAutomation } from '../common';

export class AgentXAutomation {
  private driver: ChromiumWebDriver;
  private commonExtension: CommonExtensionAutomation;
  private common: CommonAutomation;

  constructor(driver: ChromiumWebDriver) {
    this.driver = driver;
    this.commonExtension = new CommonExtensionAutomation(this.driver);
    this.common = new CommonAutomation(this.driver);
  }

  async openPage(): Promise<void> {
    // popup page
    const extensions = this.common.getInfoExtension(EExtensionName.ARGENT_X);
    await this.common.navigateToTabMatchingUrl(getPageExtension(extensions.id, extensions.page || ''));
  }

  async login(password: string): Promise<void> {
    await this.commonExtension.enterPassword(EExtensionName.ARGENT_X, { type: EElementType.css, value: 'input[type="password"]' }, password);
    await this.commonExtension.clickButton(EExtensionName.ARGENT_X, { type: EElementType.css, value: 'button[type="submit"]' });
  }
}
