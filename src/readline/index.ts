import readline from 'readline';
import { IStartEndNumbers } from '../interfaces';
import logger from '../logger';
import { EFlowNumber } from '../constant';
import chalk from 'chalk';
import MESSAGE_LOGGER from '../logger/message';
import { THROW_ERROR_PROBLEM } from '../utils';

export const getFlowNumber = (): Promise<number> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    const question = `
    ${chalk.blue('Enter a process you want to run:')} 
    1. ${chalk.blue('Clone Portable Profile')} ${chalk.red.bold('*only run once and clone folder from original*')}
    2. ${chalk.blue('Run login google')} ${chalk.red.bold('*no output*')}
    3. ${chalk.blue('Run login discord & twitter')}
    4. ${chalk.blue('Run create wallet metamask')}
    5. ${chalk.blue('Export account status & resource to .xlsx')}
    6. ${chalk.blue('Print Account Resource')}
    99.${chalk.yellow('Quit Program')}
    `;
    rl.question(question, (endInput: string) => {
      const number = parseInt(endInput);

      if (isNaN(number)) {
        reject(new Error('Invalid input. Please enter a number.'));
        rl.close();
        return;
      }

      if (!Object.values(EFlowNumber).includes(number)) {
        reject(new Error('Invalid input. Please enter exactly number.'));
        rl.close();
        return;
      }

      resolve(number);
      rl.close();
    });
  });
};

export const getNumber = (question: string): Promise<number> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question(question, (endInput: string) => {
      const number = parseInt(endInput);

      if (isNaN(number)) {
        reject(new Error('Invalid input. Please enter a number.'));
        rl.close();
        return;
      }

      resolve(number);
      rl.close();
    });
  });
};

export const getAreYouSure = (description: string): Promise<boolean> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    const question = `Are you sure you want to ${description} ? (y/n) `;
    rl.question(question, (endInput: string) => {
      if (!['y', 'n'].includes(endInput)) {
        reject(new Error('Invalid input. Please enter y/n.'));
        rl.close();
        return;
      }

      const result = endInput === 'y' ? true : false;

      resolve(result);
      rl.close();
    });
  });
};

export const getStartEndNumbers = (): Promise<IStartEndNumbers> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question(MESSAGE_LOGGER.INPUT_PORTABLE_START_NUMBER, (startInput: string) => {
      const startNumber = parseInt(startInput);

      if (isNaN(startNumber)) {
        reject(THROW_ERROR_PROBLEM(MESSAGE_LOGGER.INVALID_INPUT_NUMBER));
        rl.close();
        return;
      }

      rl.question(MESSAGE_LOGGER.INPUT_PORTABLE_END_NUMBER, (endInput: string) => {
        const endNumber = parseInt(endInput);

        if (isNaN(endNumber)) {
          reject(THROW_ERROR_PROBLEM(MESSAGE_LOGGER.INVALID_INPUT_NUMBER));
          rl.close();
          return;
        }

        if (endNumber < startNumber) {
          reject(THROW_ERROR_PROBLEM(MESSAGE_LOGGER.INVALID_ENDING_NUMBER_GREATER_THAN_STARTING_NUMBER));
          rl.close();
          return;
        }

        resolve({ start: startNumber, end: endNumber });
        rl.close();
      });
    });
  });
};
