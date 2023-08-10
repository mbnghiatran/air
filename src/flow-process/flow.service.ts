import { ChromiumWebDriver } from 'selenium-webdriver';
import CONFIG from '../config';
import logger from '../logger';
import { getAreYouSure, getNumber, getStartEndNumbers } from '../readline';
import { ExcelJSService } from '../services';
import { THROW_ERROR_PROBLEM, copyFileFromSource, deleteAllFileInFolder } from '../utils';
import { validatePathProfile } from '../validate';
import { IFlowService } from './interface';
import { handleDriver } from './handle_driver';
import { ProcessService } from './process.service';
import MESSAGE_LOGGER from '../logger/message';
import chalk from 'chalk';
import { IAccount, IAccountVerify } from '../interfaces';
import { EFlowNumber } from '../constant';
import { handleGmailAutomation } from './flow-gmail';

export class FlowService implements IFlowService {
  configFlowProcess = {
    portablePath: CONFIG.portablePath,
    originginalPortablePath: CONFIG.originalPortablePath,
    isResetDCOM: CONFIG.resetDcom,
    accountDataPath: CONFIG.accountDataPath,
    sheet: CONFIG.sheetUpload,
    exportPath: CONFIG.exportPath,
  };

  constructor() {}

  private initializeProcessService(driver: ChromiumWebDriver, accountData: IAccount[]): ProcessService {
    return new ProcessService(driver, accountData);
  }

  private getNumberPortableStartEnd = async (flow: EFlowNumber): Promise<{ start: number; end: number }> => {
    logger.info(`${this.getMessageFlowNumber(flow)} ${this.configFlowProcess.portablePath}`);

    let startNumber: number = 0;
    let endNumber: number = 0;

    try {
      const data = await getStartEndNumbers();
      startNumber = data.start;
      endNumber = data.end;
    } catch (error: any) {
      THROW_ERROR_PROBLEM(MESSAGE_LOGGER.GET_READLINE_HAVE_PROBLEM, error);
    }
    logger.info(MESSAGE_LOGGER.INPUT_PORTABLE_START_NUMBER + startNumber);
    logger.info(MESSAGE_LOGGER.INPUT_PORTABLE_END_NUMBER + endNumber);

    await validatePathProfile(startNumber, endNumber);

    return { start: startNumber, end: endNumber };
  };

  private getMessageFlowNumber = (flow: EFlowNumber): string => {
    switch (flow) {
      case EFlowNumber.CLONE_PORTABLE:
        return MESSAGE_LOGGER.FLOW_CLONE_PORTABLE;
      case EFlowNumber.LOGIN_DISCORD_AND_TWITTER:
        return MESSAGE_LOGGER.FLOW_LOGIN_DISCORD_AND_TWITTER;
      case EFlowNumber.CREATE_WALLET_METAMASK:
        return MESSAGE_LOGGER.FLOW_CREATE_WALLET_METAMASK;
      case EFlowNumber.LOGIN_GOOGLE:
        return 'LOGIN GOOGLE';
      default:
        return '';
    }
  };

  runExportAccountDataAndWallet = async (): Promise<void> => {
    const { start: startNumber, end: endNumber } = await this.getNumberPortableStartEnd(EFlowNumber.EXPORT_ACCOUNT_DATA_AND_WALLET);

    let data: IAccount[] = [];
    let errorAccountVerify: IAccountVerify[] = [
      // {
      //   twitterError: 'Account twitter not login',
      //   discordError: 'Account discord not login',
      //   gmailError: 'Account hennettsasane50156@gmail.com not login',
      //   walletError: 'Account wallet not login',
      //   discordAccount: '',
      //   twitterAccount: '',
      //   gmailAccount: '',
      //   walletAddress: '',
      //   portable: 1,
      // },
    ];
    try {
      data = await this.getAccountResource();
      logger.info(`${MESSAGE_LOGGER.COUNT_ACCOUNT_SUCCESS} ${data.length}`);
    } catch (error: any) {
      THROW_ERROR_PROBLEM(MESSAGE_LOGGER.GET_ACCOUNT_RESOURCE_HAVE_PROBLEM, error);
      return;
    }

    for (let i = startNumber; i <= endNumber; i++) {
      await handleDriver(i, false, async (driver: ChromiumWebDriver, index: number) => {
        const processService = this.initializeProcessService(driver, data);
        const accountVerifyError = await processService.handleVerifyAccountResource(index);
        errorAccountVerify.push(accountVerifyError);
      });
    }

    await this.exportAccountResource(errorAccountVerify);
  };

  runClonePortable = async (): Promise<void> => {
    let result = false;
    let numberPortable = 0;
    logger.info(`${MESSAGE_LOGGER.FLOW_CLONE_PORTABLE} ${this.configFlowProcess.portablePath}`);
    try {
      result = await getAreYouSure(chalk.red(`delete all data in folder ${this.configFlowProcess.portablePath}`));
    } catch (error: any) {
      THROW_ERROR_PROBLEM(MESSAGE_LOGGER.GET_READLINE_HAVE_PROBLEM, error);
    }

    if (result === false) {
      THROW_ERROR_PROBLEM(MESSAGE_LOGGER.YOU_NOT_SURE_DELETE_ALL_DATA_IN_FOLDER + this.configFlowProcess.portablePath);
    }

    try {
      numberPortable = await getNumber(MESSAGE_LOGGER.HOW_MANY_YOU_WANT_CLONE);
    } catch (error: any) {
      THROW_ERROR_PROBLEM(MESSAGE_LOGGER.GET_READLINE_HAVE_PROBLEM, error);
    }

    await deleteAllFileInFolder(this.configFlowProcess.portablePath);
    logger.info(MESSAGE_LOGGER.CLONE_PORTABLE_FROM_TEMPLATE + this.configFlowProcess.originginalPortablePath);

    const folder = Array.from({ length: numberPortable }, (_, i) => i + 1);
    logger.info(MESSAGE_LOGGER.PLEASE_WAITING);
    const promises = folder.map((item) =>
      copyFileFromSource(this.configFlowProcess.originginalPortablePath, this.configFlowProcess.portablePath + '/' + item.toString()),
    );
    await Promise.all(promises);

    logger.info(MESSAGE_LOGGER.CLONE_PORTABLE_SUCCESS);
  };

  runGoogleLogin = async (): Promise<void> => {
    const { start: startNumber, end: endNumber } = await this.getNumberPortableStartEnd(EFlowNumber.LOGIN_GOOGLE);

    let data: IAccount[] = [];
    try {
      data = await this.getAccountResource();
      logger.info(`${MESSAGE_LOGGER.COUNT_ACCOUNT_SUCCESS} ${data.length}`);
    } catch (error: any) {
      THROW_ERROR_PROBLEM(MESSAGE_LOGGER.GET_ACCOUNT_RESOURCE_HAVE_PROBLEM, error);
      return;
    }

    for (let i = startNumber; i <= endNumber; i++) {
      const account = data.find((item) => item.portable === i);

      if (account === undefined) {
        logger.error(`${MESSAGE_LOGGER.ACCOUNT_NOT_FOUND} ${i}`);
        continue;
      }

      await handleGmailAutomation(i, account, this.configFlowProcess.portablePath);
    }

    return;
  };

  runCreateWalletMetamask = async (): Promise<void> => {
    const { start: startNumber, end: endNumber } = await this.getNumberPortableStartEnd(EFlowNumber.CREATE_WALLET_METAMASK);

    let countChangeIP: number = 1;
    for (let i = startNumber; i <= endNumber; i++) {
      ++countChangeIP;

      if (countChangeIP % this.configFlowProcess.isResetDCOM === 0) {
        await handleDriver(i, true, async (driver: ChromiumWebDriver, index: number) => {
          const processService = this.initializeProcessService(driver, []);
          await processService.handleCreateWalletMetamask(index);
        });

        // Reset count change IP
        countChangeIP = 1;
      } else {
        await handleDriver(i, false, async (driver: ChromiumWebDriver, index: number) => {
          const processService = this.initializeProcessService(driver, []);
          await processService.handleCreateWalletMetamask(index);
        });
      }
    }
  };

  runLoginDiscordTwitter = async (): Promise<void> => {
    const { start: startNumber, end: endNumber } = await this.getNumberPortableStartEnd(EFlowNumber.LOGIN_DISCORD_AND_TWITTER);

    let data: IAccount[] = [];
    try {
      data = await this.getAccountResource();
      logger.info(`${MESSAGE_LOGGER.COUNT_ACCOUNT_SUCCESS} ${data.length}`);
    } catch (error: any) {
      THROW_ERROR_PROBLEM(MESSAGE_LOGGER.GET_ACCOUNT_RESOURCE_HAVE_PROBLEM, error);
      return;
    }

    let countChangeIP: number = 1;
    for (let i = startNumber; i <= endNumber; i++) {
      ++countChangeIP;

      if (countChangeIP % this.configFlowProcess.isResetDCOM === 0) {
        await handleDriver(i, true, async (driver: ChromiumWebDriver, index: number) => {
          const processService = this.initializeProcessService(driver, data);
          await processService.handleLoginDiscordTwitter(index);
        });

        // Reset count change IP
        countChangeIP = 1;
      } else {
        await handleDriver(i, false, async (driver: ChromiumWebDriver, index: number) => {
          const processService = this.initializeProcessService(driver, data);
          await processService.handleLoginDiscordTwitter(index);
        });
      }
    }

    return;
  };

  private getAccountResource = async (): Promise<IAccount[]> => {
    const excelService = new ExcelJSService();

    const readFromSheet: string[][] = await excelService.readDataFromExcelSheet(this.configFlowProcess.accountDataPath, this.configFlowProcess.sheet);
    return excelService.mapDataToAccountResource(readFromSheet);
  };

  private exportAccountResource = async (accountError: IAccountVerify[]): Promise<void> => {
    const excelService = new ExcelJSService();

    await excelService.exportFileAccountVerify(accountError, this.configFlowProcess.sheet, this.configFlowProcess.exportPath);
  };

  runPrintAccountResource = async (): Promise<void> => {
    logger.info(`${MESSAGE_LOGGER.FLOW_PRINT_ACCOUNT_RESOURCE} ${this.configFlowProcess.accountDataPath}`);
    const excelService = new ExcelJSService();

    const readFromSheet: string[][] = await excelService.readDataFromExcelSheet(this.configFlowProcess.accountDataPath, this.configFlowProcess.sheet);
    const data: IAccount[] = excelService.mapDataToAccountResource(readFromSheet);
    let messageLog: string = `Count: ${data.length} account\n`;
    for (const item of data) {
      messageLog += `${item.email} ${item.passEmail} | ${item.twitter} ${item.passTwitter} | ${item.discordToken} \n`;
    }

    logger.info(messageLog);
  };
}
