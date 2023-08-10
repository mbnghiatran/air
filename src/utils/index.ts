import isNotEmpty from 'lodash';
import fs from 'fs';
import logger from '../logger';
import chalk from 'chalk';

export const checkStringExist = (item: string | null): boolean => {
  if (item === null) return false;

  return isNotEmpty(item) && item !== '';
};

export const getPageExtension = (id: string, page: string): string => {
  return `chrome-extension://${id}/${page}`;
};

export const sleep = (ms: number) =>
  new Promise((r) => {
    logger.info(chalk.blue(`Sleeping for ${ms}ms`));
    setTimeout(r, ms);
  });

export const stringToRegexPattern = (str: string): RegExp => {
  const escapedStr = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escapedStr}$`);
};

export function checkPathExists(path: string) {
  return new Promise((resolve) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

export function generateProfilePath(chromePortablePath: string, currentNumber: Number): string {
  return chromePortablePath + `/${currentNumber.toString()}/data/profile`;
}

export function getQueryParamValue(param: string, url: string) {
  const parsedUrl = new URL(url);
  const fragmentParams = new URLSearchParams(parsedUrl.hash.slice(1));
  return fragmentParams.get(param);
}

export function extractOriginalUrl(urlString: string) {
  const parts = urlString.split('#');
  return parts[0];
}

export * from './file';
export * from './error';
