import CONFIG from '../config';
//@ts-ignore
import { Configuration, NopeCHAApi } from 'nopecha';

export class NopechaService {
  nopechaAPIKey = CONFIG.nopechaAPIKey;
  nopechaApi: NopeCHAApi;
  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.NOPECHA_API_KEY,
    });
    this.nopechaApi = new NopeCHAApi(configuration);
  }

  async solveRecognition(imgURL: string[]) {
    // solve a recognition challenge
    const clicks = await this.nopechaApi.solveRecognition({
      type: 'hcaptcha',
      task: 'Please click each image containing a cat-shaped cookie.',
      image_urls: Array.from({ length: imgURL.length }, (value) => value),
    });

    // print the grids to click
    console.log(clicks);
  }

  async solveToken(tokenParams: string, url: string) {
    // solve a token
    const token = await this.nopechaApi.solveToken({
      type: 'hcaptcha',
      sitekey: tokenParams,
      url: url,
    });

    // print the token
    console.log(token);
  }
}
