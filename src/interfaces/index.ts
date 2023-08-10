import { EElementType, EExtensionName, EPlatformName, ETaskType } from '../constant';

export interface IConfig {
  //Portable
  originalPortablePath: string;
  portablePath: string;
  enablePortable: boolean;
  killChromeProcess: boolean;

  //Password
  passwordWallet: string;
  nopechaAPIKey: string;
  twoCapchaAPIKey: string;

  //Data
  accountDataPath: string;
  sheetUpload: string;
  exportPath: string;

  //DCOM
  dcomPage: string;
  isChangeIP: boolean;
  resetDcom: number;
}

export interface IStartEndNumbers {
  start: number;
  end: number;
}

export interface IExtension {
  id: string;
  name: EExtensionName;
  fileName: string;
  path?: string;
  page?: string;
  installManual?: boolean;
}

export interface IPlatform {
  name: EPlatformName;
  baseUrl: string;
  projects: IProject[];
}

export interface IProject {
  name: string;
}

export interface IBy {
  type: EElementType;
  value: string;
}

export interface ITask {
  url: string;
  projectUrl: string;
}

export interface IListTask {
  [key: string]: ITask[];
}

export type ByHash =
  | { className: string }
  | { css: string }
  | { id: string }
  | { js: string }
  | { linkText: string }
  | { name: string }
  | { partialLinkText: string }
  | { tagName: string }
  | { xpath: string };

export interface IAccount {
  portable: number;
  email: string;
  passEmail: string;

  twitter: string;
  passTwitter: string;

  discordToken: string;
}

export interface IAccountVerify {
  twitterError: string | null;
  discordError: string | null;
  gmailError: string | null;
  walletError: string | null;
  portable: number;
  twitterAccount: string;
  discordAccount: string;
  gmailAccount: string;
  walletAddress: string;
}

export interface IExportAccountResource extends IAccountVerify {
  twitter: string;
  discord: string;
  gmail: string;
  wallet: string;
}
