import * as fs from 'fs';
import logger from '../logger';
import * as fse from 'fs-extra';
import { rimraf } from 'rimraf';
import * as Excel from 'exceljs';

export function saveExcelBufferToFile(buffer: Excel.Buffer, filePath: string): void {
  const stream = fs.createWriteStream(filePath);
  stream.write(buffer);
  stream.end();
}

export function isTxtFile(filepath: string): boolean {
  const extension = filepath.split('.').pop();
  if (extension !== undefined) {
    const lowercaseExtension = extension.toLowerCase();
    return lowercaseExtension === 'txt';
  }
  return false;
}

export async function deleteAllFileInFolder(path: string) {
  if (fs.existsSync(path)) {
    await rimraf(path);
    logger.info('Delete all file in folder ' + path + ' success');
  }
}

export async function copyFileFromSource(src: string, dest: string) {
  try {
    await fse.copySync(src, dest, { overwrite: false });
    logger.info('Copy file from ' + src + ' to ' + dest + ' success');
  } catch (error) {
    logger.error(`Copy file from ${src} to ${dest} have problem: ${error}`);
  }
}

export const readFileToBuffer = async (filePath: string) => {
  const data = await fs.readFileSync(filePath);
  return await Buffer.from(data);
};
