import CONFIG from '../config';
import logger from '../logger';
import { checkPathExists, generateProfilePath } from '../utils';

export const validatePathProfile = async (startNumber: number, endNumber: number): Promise<void> => {
  for (let i = startNumber; i <= endNumber; i++) {
    const profilePath = generateProfilePath(CONFIG.portablePath, i);
    const isPathExists = await checkPathExists(profilePath);
    if (!isPathExists) {
      logger.error(`Path ${profilePath} not exists`);
      throw new Error(`Path not exists ${profilePath}`);
    }
  }
};
