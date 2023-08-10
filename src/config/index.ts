import { IConfig } from '../interfaces';
import logger from '../logger';

const CONFIG: IConfig = {
  originalPortablePath: process.env.ORIGINAL_PORTABLE_PATH || '',
  portablePath: process.env.PORTABLE_PATH || '',
  passwordWallet: process.env.PASSWORD_WALLET || '12345678',
  enablePortable: process.env.ENABLE_PORTABLE === 'true' || false,
  nopechaAPIKey: process.env.NOPECHA_API_KEY || '',
  twoCapchaAPIKey: process.env.TWOCAPCHA_API_KEY || '',
  killChromeProcess: process.env.KILL_CHROME_PROCESS === 'true' || false,

  exportPath: process.env.EXPORT_PATH || '',

  //Data
  accountDataPath: process.env.ACCOUNT_DATA_PATH || '',
  sheetUpload: process.env.SHEET_UPLOAD || 'account',

  //DCOM
  dcomPage: process.env.DCOM_PAGE || '',
  isChangeIP: process.env.IS_CHANGE_IP === 'true' || false,
  resetDcom: Number(process.env.RESET_WHEN_GET_PORTABLE),
};

// check config
const checkConfig = (envProperties: (keyof IConfig)[]) => {
  for (const property of envProperties) {
    if (!CONFIG[property]) {
      logger.error(`Missing config: ${property}`);
      throw new Error(`Missing config: ${property}`);
    }
  }
};

checkConfig(['originalPortablePath', 'accountDataPath']);

export default CONFIG;
