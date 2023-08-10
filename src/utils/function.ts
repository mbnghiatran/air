import { execSync } from 'child_process';
import { ChromiumWebDriver } from 'selenium-webdriver';
import {
  TwitterSocialAutomation,
  AlphabotTaskAutomation,
  CommonPlatformAutomation,
  DcomAutomation,
  MetamaskAutomate,
  SuiWalletAutomate,
  AgentXAutomation,
} from '../auto';
import { PLATFORM } from '../constant';
import CONFIG from '../config';
import logger from '../logger';

/** @description: kill chrome when it's exist */
export const killChromeDriverProcesses = async () => {
  await execSync('taskkill /im chrome.exe /f');
};

/** @description: handle login wallet extension */
export const handleLoginExtension = async (driver: ChromiumWebDriver) => {
  // Metamask
  const metamaskAutomate = new MetamaskAutomate(driver);
  await metamaskAutomate.openPage();
  await metamaskAutomate.login(CONFIG.passwordWallet);
  await metamaskAutomate.validateUnlockSuccess();

  // Agent X
  const agentXAutomation = new AgentXAutomation(driver);
  await agentXAutomation.openPage();
  await agentXAutomation.login(CONFIG.passwordWallet);

  // SUI Wallet
  const suiWalletAutomation = new SuiWalletAutomate(driver);
  await suiWalletAutomation.openPage();
  await suiWalletAutomation.login(CONFIG.passwordWallet);
};

/** @description: handle automation task in each platform */
export const handleAutomationTask = async (driver: ChromiumWebDriver) => {
  const platformAutomation = new CommonPlatformAutomation(driver, PLATFORM);
  await platformAutomation.getPlatformProject();

  const alphabotTaskAutomation = new AlphabotTaskAutomation(driver);
  await alphabotTaskAutomation.getListTasks();
};

/** @description: handle prepare login */
export const handlePrepareLogin = async (driver: ChromiumWebDriver, portableNumber: number) => {
  // const twitterSocialAutomation = new TwitterSocialAutomation(driver);
  // await twitterSocialAutomation.extractData();
  // await twitterSocialAutomation.openLoginPage();
  // if ((await twitterSocialAutomation.checkLoginSuccess()) === true) return;
  // await twitterSocialAutomation.loginTwitter(portableNumber);
};

/** @description: open config nopecha */
export const handleOpenConfigNopecha = async (driver: ChromiumWebDriver) => {
  driver.get(`https://nopecha.com/setup#${CONFIG.nopechaAPIKey}`);
};

/** @description: handle dcom automation */
export const handleDcomAutomation = async (driver: ChromiumWebDriver) => {
  logger.info('Run reset IP');
  const dcomAutomation = new DcomAutomation(driver);
  await dcomAutomation.openPageDcom();
};
