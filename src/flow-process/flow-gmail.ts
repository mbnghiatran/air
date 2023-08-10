import path from 'path';
import { IAccount } from '../interfaces';
import { execSync } from 'child_process';
import { THROW_ERROR_PROBLEM } from '../utils';
import logger from '../logger';
import chalk from 'chalk';

export const handleGmailAutomation = async (portableNumber: number, account: IAccount, portablePath: string) => {
  try {
    const pythonPath = path.resolve(__dirname, `../../`, 'python', 'gmail.py');

    const profileData: string = portablePath + `/${portableNumber.toString()}/data/profile`;
    const chromePortablePath: string = portablePath + `/${portableNumber.toString()}/GoogleChromePortable.exe`;
    const execCommand = `python ${pythonPath} ${account.email} ${account.passEmail} ${profileData} ${chromePortablePath}  `;
    logger.info(`Run python service gmail automation ${execCommand}`);

    const output = await execSync(execCommand).toString();

    if (output.includes('false')) {
      throw `Error when handle gmail automation: ${output}`;
    }
    logger.info(chalk.green(`Gmail login automation success - ${portableNumber} - ${account.email}`));
  } catch (error) {
    THROW_ERROR_PROBLEM(`Error when handle gmail automation: ${error}`);
  }
};
