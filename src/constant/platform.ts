import { EPlatformName } from '../constant';
import { IPlatform } from '../interfaces';
import { PROJECTS_ALPHABOT } from './project';

export const PLATFORM: IPlatform[] = [
  {
    name: EPlatformName.PREMINT,
    baseUrl: 'premint.xyz',
    projects: [],
  },
  {
    name: EPlatformName.ALPHABOT,
    baseUrl: 'https://www.alphabot.app',
    projects: PROJECTS_ALPHABOT,
  },
];
