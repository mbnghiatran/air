import { ChromiumWebDriver } from 'selenium-webdriver';
import { startDriver } from '../driver';
import logger from '../logger';
import { execSync } from 'child_process';
import MESSAGE_LOGGER from '../logger/message';
import CONFIG from '../config';
import { getPageExtension, sleep } from '../utils';
import { EXTENSIONS } from '../extensions';
import { IExtension } from '../interfaces';
import { EXTENSIONS_ACTIVE } from '../extensions';
import { EExtensionName } from '../constant';

const killChromeDriverProcesses = async () => {
  if (CONFIG.killChromeProcess) {
    logger.info(MESSAGE_LOGGER.KILL_TERMINAL_CHROME_SUCCESS);
    await execSync('taskkill /im chrome.exe /f');
  }
};

const waitExtensionLoadSuccess = async (driver: ChromiumWebDriver): Promise<void> => {
  const extensionArr: IExtension[] = EXTENSIONS_ACTIVE.map((item) => {
    return EXTENSIONS.find((extension) => extension.name === item);
  }).filter((item) => item !== undefined) as IExtension[];

  let loop = false;

  let extensionLoadSuccessArr: EExtensionName[] = [];
  const windowHandle = await driver.getWindowHandle();
  while (loop === false) {
    const windowHandles = await driver.getAllWindowHandles();

    for (const item of windowHandles) {
      await driver.switchTo().window(item);

      const currentURL: string = await driver.getCurrentUrl();

      const extensionLoadSuccess = extensionArr.find((extension: IExtension) => {
        return currentURL.includes(getPageExtension(extension.id, extension.page || ''));
      });
      if (extensionLoadSuccess) {
        logger.info(MESSAGE_LOGGER.LOAD_EXTENSION_SUCCESS.replace('{{EXTENSION_NAME}}', extensionLoadSuccess.name));
        extensionLoadSuccessArr.push(extensionLoadSuccess.name);
        logger.info(`Close tab ${currentURL}`);
        await driver.close();
      }
    }

    if (extensionLoadSuccessArr.length === extensionArr.length) {
      loop = true;
    }
  }

  logger.info(MESSAGE_LOGGER.ALL_EXTENSION_LOADED_SUCCESS);
  await driver.switchTo().window(windowHandle);
};

export async function handleDriver(index: number, changeIP: boolean, callBack: (driver: ChromiumWebDriver, index: number) => void): Promise<void> {
  try {
    await killChromeDriverProcesses();
  } catch (error) {
    logger.error(MESSAGE_LOGGER.KILL_TERMINAL_HAVE_PROBLEM, error);
  }

  try {
    const driver: ChromiumWebDriver = await startDriver(index);
    // await handleOpenConfigNopecha(driver)

    try {
      await driver
        .getAllWindowHandles()
        .then((handles) => {
          const promises = handles.map(async (handle) => {
            await driver.switchTo().window(handle);
            await driver.executeScript('return document.readyState').then((readyState) => {
              return readyState === 'complete';
            });
          });
          return Promise.all(promises);
        })
        .then((_) => {
          logger.info(MESSAGE_LOGGER.ALL_TAB_LOADED_SUCCESS);
        });

      // Wait for all extensions to finish loading
      await waitExtensionLoadSuccess(driver);

      await callBack(driver, index);

      // @note: quit driver. Comment because we need to check result
      await driver.quit();
    } catch (error) {
      await driver.quit();
      throw new Error('error: ' + error);
    }
  } catch (error) {
    logger.error(MESSAGE_LOGGER.INITIALIZE_DRIVER_HAVE_PROBLEM + error);
  }
}
