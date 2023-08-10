import path from 'path';
import { IExtension } from './interfaces';
import { EExtensionName } from './constant';
import { MetamaskAutomate } from './auto';
import { ChromiumWebDriver } from 'selenium-webdriver';
import logger from './logger';
import { sleep } from './utils';

// @DESCRIPTION: Add or remove extensions here
export const EXTENSIONS_ACTIVE: EExtensionName[] = [
  EExtensionName.META_MASK,
  // EExtensionName.ARGENT_X,
  // EExtensionName.SUI
  // EExtensionName.NOPE_CHA,
  // EExtensionName.TWOCAPCHA,
];

export const EXTENSIONS: IExtension[] = [
  {
    id: 'dknlfmjaanfblgfdfebhijalfmhmjjjo',
    name: EExtensionName.NOPE_CHA,
    fileName: 'nopecha.crx',
    page: 'home.html',
    installManual: false,
  },
  {
    id: 'ifibfemgeogfhoebkmokieepdoobkbpo',
    name: EExtensionName.TWOCAPCHA,
    fileName: 'twocapcha.crx',
    page: 'home.html',
    installManual: false,
  },
  {
    id: 'nkbihfbeogaeaoehlefnkodbefgpgknn',
    name: EExtensionName.META_MASK,
    fileName: 'meta_mask.crx',
    page: 'home.html',
    installManual: true,
  },
  {
    id: 'bfnaelmomeimhlpmgjnjophhpkkoljpa',
    name: EExtensionName.PHANTOM,
    fileName: 'phantom.crx',
    page: 'home.html',
    installManual: false,
  },
  {
    id: 'dlcobpjiigpikoobohmabehhmhfoodbb',
    name: EExtensionName.ARGENT_X,
    fileName: 'argent_x.crx',
    page: 'lock-screen',
    installManual: false,
  },
  {
    id: 'opcgpfmipidbgpenhmajoajpbobppdil',
    name: EExtensionName.SUI,
    fileName: 'sui_wallet.crx',
    page: 'ui.html',
    installManual: false,
  },
  {
    id: 'khpkpbbcccdmmclmpigdgddabeilkdpd',
    name: EExtensionName.SUIET,
    fileName: 'suiet_wallet.crx',
    page: 'home.html',
    installManual: false,
  },
];

export const getExtensionsPath = (): IExtension[] => {
  return EXTENSIONS.filter((item) => EXTENSIONS_ACTIVE.includes(item.name)).map((item) => ({
    ...item,
    path: path.resolve(__dirname, `./extension-crx/${item.fileName}`),
  }));
};
