import { Actions, By, ChromiumWebDriver, Key, until } from 'selenium-webdriver';
import { CommonExtensionAutomation } from './common';
import { EElementType, EExtensionName, TIME_WAITING } from '../../constant';
import logger from '../../logger';
import { getPageExtension, sleep } from '../../utils';
import { CommonAutomation, ElementAutomation } from '../common';
import { IBy } from '../../interfaces';
import CONFIG from '../../config';
//@ts-ignore
import clipboard from 'node-clipboardy';

export class MetamaskAutomate {
  private driver: ChromiumWebDriver;
  private commonExtension: CommonExtensionAutomation;
  private common: CommonAutomation;
  private elementAutomation: ElementAutomation;

  private defaultPassword = CONFIG.passwordWallet;

  constructor(driver: ChromiumWebDriver) {
    this.driver = driver;
    this.commonExtension = new CommonExtensionAutomation(this.driver);
    this.common = new CommonAutomation(this.driver);
    this.elementAutomation = new ElementAutomation(this.driver);
  }

  async getWalletAddressMetamask(): Promise<string> {
    await this.openPage();
    await this.enterPasswordMetaMask();
    await this.closePopOver();
    const buttonClickCopy: IBy = { type: EElementType.className, value: 'selected-account__clickable' };
    const buttonCopy = await this.elementAutomation.waitElementLocated(buttonClickCopy);

    await buttonCopy.click();

    const text = await clipboard.readSync();

    logger.info(`Wallet address: ${text}`);

    return text;
  }

  async handleCreateWalletMetamask() {
    await this.openPage();
    const isCreateWalletBefore = await this.checkWalletCreateBefore();

    if (!isCreateWalletBefore) {
      await this.createNewWalletOutSignIn();
      return;
    }

    await this.enterPasswordMetaMask();
    await this.closePopOver();
  }

  async closePopOver() {
    try {
      await this.driver.wait(until.urlContains('home.html'), 2000);
      const ByButtonClosePopOver: IBy = { type: EElementType.css, value: 'button[data-testid="popover-close"]' };
      const buttonClosePopOver = await this.elementAutomation.waitElementLocated(ByButtonClosePopOver);

      logger.info('Close popover metamask');
      await buttonClosePopOver.click();
    } catch (error) {
      console.log(error);
    }
  }

  async openPage(): Promise<void> {
    // popup page
    const extensions = this.common.getInfoExtension(EExtensionName.META_MASK);
    // await this.common.navigateToTabMatchingUrl(getPageExtension(extensions.id, extensions.page || ''));
    await this.driver.switchTo().newWindow('tab');
    await this.driver.get(getPageExtension(extensions.id, extensions.page || ''));
  }

  async checkWalletCreateBefore(): Promise<boolean> {
    try {
      await this.driver.wait(until.urlContains('#initialize/welcome'), 2000);
      logger.info('Wallet Metamask is not created before');
      return false;
    } catch (error) {
      logger.info('Wallet Metamask is created before');
      return true;
    }
  }

  async enterPasswordMetaMask() {
    await this.driver.wait(until.urlContains('unlock'), 2000);

    const ByInputEnterPassword: IBy = { type: EElementType.id, value: 'password' };
    const inputEnterPassword = await this.elementAutomation.waitElementLocated(ByInputEnterPassword);

    await inputEnterPassword.clear();
    await inputEnterPassword.sendKeys(this.defaultPassword);

    const ByUnlock: IBy = { type: EElementType.css, value: 'button[type="submit"]' };
    const buttonUnlock = await this.elementAutomation.waitElementLocated(ByUnlock);
    await buttonUnlock.click();
  }

  async createNewWalletOutSignIn() {
    logger.info('Start create new wallet');
    const ByStartButton: IBy = { type: EElementType.xpath, value: '//button[contains(text(), "Get Started")]' };
    const ByCreateButton: IBy = { type: EElementType.xpath, value: '//button[contains(text(), "Create a Wallet")]' };
    const ByAgreeImproveMetamask: IBy = { type: EElementType.css, value: 'button[data-testid="page-container-footer-next"]' };
    const ByInputCreateNewPassword: IBy = { type: EElementType.id, value: 'create-password' };
    const ByInputCreateNewConfirm: IBy = { type: EElementType.id, value: 'confirm-password' };
    const ByPasswordTerms: IBy = { type: EElementType.className, value: 'first-time-flow__checkbox' };
    const ByConfirmPassword: IBy = { type: EElementType.xpath, value: '//button[contains(text(), "Create")]' };
    const ByButtonSecureWallet: IBy = { type: EElementType.xpath, value: '//button[contains(text(), "Next")]' };
    const ByConfirmSkipAccountSecurity: IBy = { type: EElementType.css, value: '//button[contains(text(), "Remind me later")]' };
    const ByAllDone: IBy = { type: EElementType.css, value: '//button[contains(text(), "All Done")]' };

    // 1, Click button Create Wallet
    const buttonStart = await this.elementAutomation.waitElementLocated(ByStartButton);

    await buttonStart.click();

    await this.driver.wait(until.urlContains('/select-action'), 5000);

    //2, Click button Create Wallet
    const buttonCreate = await this.elementAutomation.waitElementLocated(ByCreateButton);
    await buttonCreate.click();

    const buttonAgreeImprove = await this.elementAutomation.waitElementLocated(ByAgreeImproveMetamask);
    await buttonAgreeImprove.click();

    // 3. Enter password
    const inputCreateNewPassword = await this.elementAutomation.waitElementLocated(ByInputCreateNewPassword);
    const inputCreateConfirmPassword = await this.elementAutomation.waitElementLocated(ByInputCreateNewConfirm);
    const inputCreatePasswordTerms = await this.elementAutomation.waitElementLocated(ByPasswordTerms);
    const buttonCreatePasswordWallet = await this.elementAutomation.waitElementLocated(ByConfirmPassword);

    await inputCreateNewPassword.clear();
    await inputCreateNewPassword.sendKeys(this.defaultPassword);

    await inputCreateConfirmPassword.clear();
    await inputCreateConfirmPassword.sendKeys(this.defaultPassword);

    await inputCreatePasswordTerms.click();
    await buttonCreatePasswordWallet.click();

    // 4. Click button Secure Wallet Later
    const buttonSecureWallet = await this.elementAutomation.waitElementLocated(ByButtonSecureWallet);
    await buttonSecureWallet.click();

    //5. Click button Remind me later
    const buttonConfirmSkipAccountSecurity = await this.elementAutomation.waitElementLocated(ByConfirmSkipAccountSecurity);
    await buttonConfirmSkipAccountSecurity.click();

    //6. Click button All Done
    const buttonAllDone = await this.elementAutomation.waitElementLocated(ByAllDone);
    await buttonAllDone.click();
  }

  async createNewWallet() {
    logger.info('Start create new wallet');

    const ByCreateWallet: IBy = { type: EElementType.css, value: 'button[data-testid="onboarding-create-wallet"]' };
    const ByAgreeMetrics: IBy = { type: EElementType.css, value: 'button[data-testid="onboarding-metametrics"]' };
    const ByInputCreateNewPassword: IBy = { type: EElementType.css, value: 'input[data-testid="create-password-new"]' };
    const ByInputCreateNewConfirm: IBy = { type: EElementType.css, value: 'input[data-testid="create-password-confirm"]' };
    const ByPasswordTerms: IBy = { type: EElementType.css, value: 'input[data-testid="create-password-terms"]' };
    const ByCreatePasswordWallet: IBy = { type: EElementType.css, value: 'button[data-testid="create-password-wallet"]' };
    const ByButtonSecureWalletLater: IBy = { type: EElementType.css, value: 'button[data-testid="secure-wallet-later"]' };
    const ByConfirmSkipAccountSecurity: IBy = { type: EElementType.css, value: 'input[data-testid="skip-srp-backup-popover-checkbox"]' };
    const ByConfirmSkip: IBy = { type: EElementType.css, value: 'button[data-testid="skip-srp-backup"]' };
    const ByGotIt: IBy = { type: EElementType.css, value: 'button[data-testid="onboarding-complete-done"]' };
    const ByPinExtensionNext: IBy = { type: EElementType.css, value: 'button[data-testid="pin-extension-next"]' };
    const ByPinExtensionNextDone: IBy = { type: EElementType.css, value: 'button[data-testid="pin-extension-done"]' };

    // 1, Click button Create Wallet
    const buttonCreateWallet = await this.elementAutomation.waitElementLocated(ByCreateWallet);
    await buttonCreateWallet.click();

    // Check Page Have Change
    await this.driver.wait(until.urlContains('/metametrics'), 1000);

    // 2. Click button Agree Metrics
    const buttonAgreeMetrics = await this.elementAutomation.waitElementLocated(ByAgreeMetrics);
    await buttonAgreeMetrics.click();

    // Check Page Have Change
    await this.driver.wait(until.urlContains('/create-password'), 1000);

    // 3. Enter password
    const inputCreateNewPassword = await this.elementAutomation.waitElementLocated(ByInputCreateNewPassword);
    const inputCreateConfirmPassword = await this.elementAutomation.waitElementLocated(ByInputCreateNewConfirm);
    const inputCreatePasswordTerms = await this.elementAutomation.waitElementLocated(ByPasswordTerms);
    const buttonCreatePasswordWallet = await this.elementAutomation.waitElementLocated(ByCreatePasswordWallet);

    await inputCreateNewPassword.clear();
    await inputCreateNewPassword.sendKeys(this.defaultPassword);

    await inputCreateConfirmPassword.clear();
    await inputCreateConfirmPassword.sendKeys(this.defaultPassword);

    await inputCreatePasswordTerms.click();
    await buttonCreatePasswordWallet.click();

    await this.driver.wait(until.urlContains('/secure-your-wallet'), 1000);

    // 4. Click button Secure Wallet Later
    const buttonSecureWalletLater = await this.elementAutomation.waitElementLocated(ByButtonSecureWalletLater);
    await buttonSecureWalletLater.click();

    // 5. Click button Confirm Skip Account Security
    const checkboxSkipAccountSecurity = await this.elementAutomation.waitElementLocated(ByConfirmSkipAccountSecurity);
    const buttonConfirmSkip = await this.elementAutomation.waitElementLocated(ByConfirmSkip);
    await checkboxSkipAccountSecurity.click();
    await buttonConfirmSkip.click();

    await this.driver.wait(until.urlContains('/completion'), 1000);

    // 6. Click button Got It
    const buttonGotIt = await this.elementAutomation.waitElementLocated(ByGotIt);
    await buttonGotIt.click();

    await this.driver.wait(until.urlContains('/pin-extension'), 1000);

    // 7. Click button Got It
    const buttonPinNext = await this.elementAutomation.waitElementLocated(ByPinExtensionNext);
    await buttonPinNext.click();

    const buttonPinNextDone = await this.elementAutomation.waitElementLocated(ByPinExtensionNextDone);
    await buttonPinNextDone.click();

    await this.driver.wait(until.urlContains('/home.html'), 1000);

    // 8. Popover close
    // ...

    logger.info('Create new wallet successfully!');
  }

  async validateUnlockSuccess(): Promise<void> {
    try {
      const element = await this.driver.wait(until.elementLocated(By.id('password-helper-text')), TIME_WAITING.WAITING_ELEMENT_LOCATED);

      if (element) {
        logger.error('Incorrect password entered.');
      }
    } catch (error) {
      logger.info('Password entered successfully!');
    }
  }

  async login(password: string): Promise<void> {
    await this.commonExtension.enterPassword(EExtensionName.META_MASK, { type: EElementType.id, value: 'password' }, password);
    await this.commonExtension.clickButton(EExtensionName.META_MASK, { type: EElementType.css, value: 'button[data-testid="unlock-submit"]' });
  }
}
