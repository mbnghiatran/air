import { execSync } from 'child_process';
import { ChromiumWebDriver, until } from 'selenium-webdriver';
import {
  AgentXAutomation,
  AlphabotTaskAutomation,
  CommonPlatformAutomation,
  DcomAutomation,
  DiscordAutomation,
  GmailSocialAutomation,
  MetamaskAutomate,
  SuiWalletAutomate,
  TwitterSocialAutomation,
} from '../auto';
import CONFIG from '../config';
import { PLATFORM } from '../constant';
import logger from '../logger';
import { IProcessService } from './interface';
import { IAccount, IAccountVerify } from '../interfaces';
import { THROW_ERROR_PROBLEM } from '../utils';

export class ProcessService implements IProcessService {
  driver: ChromiumWebDriver;

  //Extension Service
  metamaskAutomation: MetamaskAutomate;
  agentXAutomation: AgentXAutomation;
  suiWalletAutomation: SuiWalletAutomate;

  //Platform Service
  platformAutomation: CommonPlatformAutomation;
  alphabotAutomation: AlphabotTaskAutomation;

  //DCOM Service
  dcomAutomation: DcomAutomation;

  //Social
  twitterAutomation: TwitterSocialAutomation;
  gmailAutomation: GmailSocialAutomation;
  discordAutomation: DiscordAutomation;

  //Account
  accountData: IAccount[] = [];

  portablePath = CONFIG.portablePath;

  constructor(driver: ChromiumWebDriver, accountResource?: IAccount[]) {
    this.driver = driver;

    // Extension Service
    this.metamaskAutomation = new MetamaskAutomate(driver);
    this.agentXAutomation = new AgentXAutomation(driver);
    this.suiWalletAutomation = new SuiWalletAutomate(driver);

    // Platform Service
    this.platformAutomation = new CommonPlatformAutomation(driver, PLATFORM);
    this.alphabotAutomation = new AlphabotTaskAutomation(driver);

    //DCOM
    this.dcomAutomation = new DcomAutomation(driver);

    //Social
    this.twitterAutomation = new TwitterSocialAutomation(driver);
    this.gmailAutomation = new GmailSocialAutomation(driver);
    this.discordAutomation = new DiscordAutomation(driver);

    this.accountData = [...(accountResource || [])];
  }

  /** @description: open config nopecha */
  handleOpenConfigNopecha = async () => {
    this.driver.get(`https://nopecha.com/setup#${CONFIG.nopechaAPIKey}`);
  };

  findAccount(portableNumber: number): IAccount {
    const account = this.accountData.find((item) => item.portable === portableNumber) as IAccount;

    if (account === undefined) {
      THROW_ERROR_PROBLEM(`Account with portable number ${portableNumber} not found`);
    }

    return account;
  }

  handleCreateWalletMetamask = async (portableNumber: number) => {
    logger.info(`Create wallet Metamask at portable number: ${portableNumber}`);
    await this.metamaskAutomation.handleCreateWalletMetamask();
  };

  handleVerifyAccountResource = async (portableNumber: number): Promise<IAccountVerify> => {
    const account = this.findAccount(portableNumber);

    const accountVerify: IAccountVerify = {
      twitterError: null,
      discordError: null,
      gmailError: null,
      walletError: null,
      twitterAccount: account.twitter,
      discordAccount: account.discordToken,
      gmailAccount: account.email,
      walletAddress: '',
      portable: portableNumber,
    };

    // try {
    //   if ((await this.gmailAutomation.checkLoginByGoToMyAccount(account)) === false) {
    //     // @TODO - check it respond account in resource
    //     // ...

    //     accountVerify.gmailError = `Account ${account.email} not login`;
    //   }
    // } catch (error: any) {
    //   accountVerify.gmailError = error.message;
    //   logger.error(error.message);
    // }

    // try {
    //   await this.twitterAutomation.openLoginPage();
    //   if ((await this.twitterAutomation.checkLoginSuccess(account)) === false) {
    //     // @TODO - check it respond account in resource
    //     // ...

    //     accountVerify.twitterError = `Account ${account.twitter} not login`;
    //   }
    // } catch (error: any) {
    //   accountVerify.twitterError = error.message;
    //   logger.error(error.message);
    // }

    // try {
    //   await this.discordAutomation.openLoginPage();
    //   if ((await this.discordAutomation.checkLoginSuccess(account)) === false) {
    //     // @TODO - check it respond account in resource
    //     // ...

    //     accountVerify.discordError = `Account discord not login`;
    //   }
    // } catch (error: any) {
    //   accountVerify.discordError = error.message;
    //   logger.error(error.message);
    // }

    try {
      const address = await this.metamaskAutomation.getWalletAddressMetamask();
      accountVerify.walletAddress = address;
    } catch (error: any) {
      accountVerify.walletError = error.message;
      logger.error(error.message);
    }

    return accountVerify;
  };

  /** @description: handle initialize portable */
  handleLoginDiscordTwitter = async (portableNumber: number) => {
    // Find Account
    const account = this.findAccount(portableNumber);

    //Twitter;
    await this.twitterAutomation.openLoginPage();
    if ((await this.twitterAutomation.checkLoginSuccess(account)) === false) {
      await this.twitterAutomation.loginTwitter(account);
    }

    // Gmail
    // await this.gmailAutomation.handleLoginGmail(account);

    await this.discordAutomation.openLoginPage();
    //Discord
    if ((await this.discordAutomation.checkLoginSuccess(account)) === false) {
      await this.discordAutomation.handleLoginDiscord(account);
    }
  };

  /** @description: handle dcom automation */
  handleDcomAutomation = async () => {
    logger.info('Run reset IP');
    await this.dcomAutomation.openPageDcom();
  };

  /** @description: handle automation task in each platform */
  handleAutomationTask = async () => {
    await this.platformAutomation.getPlatformProject();
    await this.alphabotAutomation.getListTasks();
  };
}
