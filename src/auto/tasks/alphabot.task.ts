import { By, ChromiumWebDriver } from 'selenium-webdriver';
import logger from '../../logger';
import { ElementAutomation } from '../common';
import { EElementType, ETaskType } from '../../constant';
import { CommonTaskAutomation } from './common';

export class AlphabotTaskAutomation {
  private driver: ChromiumWebDriver;
  private elementAutomation: ElementAutomation;
  private commonTaskAutomation: CommonTaskAutomation;

  constructor(driver: ChromiumWebDriver) {
    this.driver = driver;
    this.elementAutomation = new ElementAutomation(this.driver);
    this.commonTaskAutomation = new CommonTaskAutomation(this.driver);
  }

  async getListTasks(): Promise<void> {
    await this.elementAutomation.waitElementLocated({ type: EElementType.css, value: 'div[role="alert"]' });
    const elementsQuestionMark = await this.driver.findElements(By.css('div[role="alert"] svg[data-testid="QuestionMarkIcon"]'));
    const elementsParent = await Promise.all(elementsQuestionMark.map(async (item) => await item.findElement(By.xpath('../..'))));

    for (const item of elementsParent) {
      const test = await item.findElement(By.css('p'));
      const parentTest = await test.findElement(By.xpath('..'));

      const content = await test.getText();
      const taskType = this.commonTaskAutomation.getTaskType(content);

      const childTask = await parentTest.findElements(By.css('a'));

      logger.info(`taskType: ${taskType} with ${childTask.length} tasks`);

      const windowHandle = await this.driver.getWindowHandle();
      for (const item of childTask) {
        const url = await item.getAttribute('href');
        logger.info(`url: ${url} `);

        await this.driver.switchTo().newWindow('tab');
        await this.driver.get(url);
        switch (taskType) {
          case ETaskType.follow:
            await this.commonTaskAutomation.followTwitterAccount(url);
            break;
          case ETaskType.tweet:
            await this.commonTaskAutomation.retweetAccount(url);
            break;
          case ETaskType.join:
            await this.commonTaskAutomation.acceptInviteDiscord(url);
            break;
          default:
            break;
        }

        await this.driver.switchTo().window(windowHandle);
      }
    }
  }
}
