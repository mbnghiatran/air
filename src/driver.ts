import chrome from 'selenium-webdriver/chrome';
import CONFIG from './config';
import logger from './logger';
import fs from 'fs';
import chromeDriver from 'chromedriver';
import { checkStringExist, sleep } from './utils';
import { ChromiumWebDriver } from 'selenium-webdriver';
import { DriverService } from 'selenium-webdriver/remote';
import { getExtensionsPath } from './extensions';
import { PageLoadStrategy } from 'selenium-webdriver/lib/capabilities';

export const checkPathToSetOptions = (name: string, path: string, callback: Function): void => {
  if (fs.existsSync(path) && checkStringExist(path)) {
    logger.info(`${path} exists`);
    callback(path);
  } else {
    logger.error(`${name} file does not exist`);
  }
};

export const startDriver = async (currentNumber: number): Promise<ChromiumWebDriver> => {
  let options: chrome.Options = new chrome.Options();
  const portablePath: string = CONFIG.portablePath;
  const profileData: string = portablePath + `/${currentNumber.toString()}/data/profile`;
  const chromePortablePath: string = portablePath + `/${currentNumber.toString()}/GoogleChromePortable.exe`;

  // Remove Add extensions CRX
  for (const file of getExtensionsPath()) {
    logger.info(`Adding extension: ${file.fileName}`);
    options.addExtensions(file.path);
  }

  // Add user profile data
  logger.info('Profile data: ' + profileData);
  checkPathToSetOptions('Profile', profileData, (path: string) => {
    options.addArguments(`--user-data-dir=${path}`);
  });

  logger.info('Chrombe portable enabled: ' + CONFIG.enablePortable);
  // Add chrome portable path
  if (CONFIG.enablePortable) {
    checkPathToSetOptions('ChromePortable', chromePortablePath, (path: string) => {
      options.setChromeBinaryPath(path);
    });
  }

  options.setPageLoadStrategy(PageLoadStrategy.NONE);
  options.addArguments('start-maximized');
  options.addArguments('enable-automation');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');
  options.addArguments('disable-infobars');

  const service: DriverService = new chrome.ServiceBuilder(chromeDriver.path).build();

  // configure browser options ...
  const driver: chrome.Driver = chrome.Driver.createSession(options, service);

  return driver;
};
