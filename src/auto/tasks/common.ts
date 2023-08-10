import { Actions, By, ChromiumWebDriver } from 'selenium-webdriver';
import logger from '../../logger';
import { EElementType, ETaskType } from '../../constant';
import { extractOriginalUrl, getQueryParamValue, sleep, stringToRegexPattern } from '../../utils';
import { CommonAutomation, ElementAutomation } from '../common';
import { NopechaService, TwoCapchaService } from '../../services';

export class CommonTaskAutomation {
  private driver: ChromiumWebDriver;
  private element: ElementAutomation;
  private common: CommonAutomation;
  private nopeChaService: NopechaService;
  private twoCapchaService: TwoCapchaService;

  constructor(driver: ChromiumWebDriver) {
    this.driver = driver;
    this.element = new ElementAutomation(this.driver);
    this.common = new CommonAutomation(this.driver);
    this.nopeChaService = new NopechaService();
    this.twoCapchaService = new TwoCapchaService();
  }

  getTaskType(content: string): ETaskType {
    let result = null;
    for (const item of Object.values(ETaskType)) {
      const pattern = new RegExp(item, 'i');

      if (pattern.test(content)) {
        result = item;
      }
      continue;
    }

    if (!result) {
      throw new Error('Task type not found');
    }

    return result;
  }

  async acceptInviteDiscord(url: string): Promise<void> {
    try {
      await this.element.waitElementLocated({ type: EElementType.css, value: "button[type='button']" });
      const buttonAccept = await this.driver.findElement(By.css("button[type='button']"));
      await buttonAccept.click();

      // await sleep(10000);

      // const iframe = await this.driver.findElement(By.css('iframe'));
      // const iframeUrl = await iframe.getAttribute('src');

      // const siteKey = getQueryParamValue('sitekey', iframeUrl);

      // if (!siteKey) {
      //   throw new Error('Site key not found');
      // }

      // await this.twoCapchaService.confirmCapcha(siteKey, 'https://discord.com/api/v9/invites/zgtVwGQDjU');

      // logger.info('Accept invite discord success');
    } catch (error) {
      logger.error(`Failed to accept invite discord: ${url}` + error);
    }
  }

  async retweetAccount(url: string): Promise<void> {
    try {
      await this.element.waitElementLocated({ type: EElementType.css, value: "div[data-testid='confirmationSheetConfirm'" });
      const element = await this.driver.findElement(By.css("div[data-testid='confirmationSheetConfirm'"));

      await element.click();
      logger.info('Retweet twitter success');
    } catch (error) {
      logger.error(`Failed to Retweet twitter: ${url}` + error);
    }
  }

  async followTwitterAccount(url: string): Promise<void> {
    try {
      await this.element.waitElementLocated({ type: EElementType.css, value: "div[data-testid='confirmationSheetConfirm'" });
      const element = await this.driver.findElement(By.css("div[data-testid='confirmationSheetConfirm'"));

      await element.click();
      logger.info('Follow twitter account success ');
    } catch (error) {
      logger.error(`Failed to follow twitter account: ${url}` + error);
    }
  }

  async tweetTwitter(url: string): Promise<void> {
    try {
      await this.element.waitElementLocated({ type: EElementType.css, value: "div[data-testid='confirmationSheetConfirm'" });
      const element = await this.driver.findElement(By.css("div[data-testid='confirmationSheetConfirm'"));

      await element.click();
      logger.info('Twitter tweet success ');
    } catch (error) {
      logger.error(`Failed to tweet twitter post: ${url}` + error);
    }
  }
}
