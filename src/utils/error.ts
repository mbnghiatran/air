import chalk from 'chalk';
import logger from '../logger';

export const THROW_ERROR_PROBLEM = (prefix: string, error?: string): Error => {
  const errorMessage = error ? `: ${error}` : '';
  const message = `${prefix} have problem ${errorMessage} `;
  logger.error(chalk.whiteBright.bgRed(message));
  throw new Error(message);
};
