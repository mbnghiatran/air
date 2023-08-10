import { ChromiumWebDriver } from 'selenium-webdriver';
import { IPlatform, IProject } from '../../interfaces';
import logger from '../../logger';

export class CommonPlatformAutomation {
  private driver: ChromiumWebDriver;
  private platform: IPlatform[];

  constructor(driver: ChromiumWebDriver, platform: IPlatform[]) {
    this.driver = driver;
    this.platform = platform;
  }

  async getPlatformProject(): Promise<void> {
    for (const platform of this.platform) {
      const { name, baseUrl, projects } = platform;

      for (const project of projects) {
        const urlOpen = `${baseUrl}/${project.name}`;
        await this.driver.switchTo().newWindow('tab');
        await this.driver.get(urlOpen);
      }
    }
  }
}
