import axios from 'axios';
import CONFIG from '../config';
import * as Captcha from '2captcha';

export class TwoCapchaService {
  twoCapchaAPIKey = CONFIG.twoCapchaAPIKey;
  solver: Captcha.Solver;

  constructor() {
    const solver = new Captcha.Solver(this.twoCapchaAPIKey);
    this.solver = solver;
  }

  async confirmCapcha(siteKey: string, apiURL: string) {
    console.log('Solving captcha...');

    // Sitekey & Domain
    const { data } = await this.solver.hcaptcha(siteKey, 'https://discord.com/invite/zgtVwGQDjU');

    console.log('Solving success', data);

    // try {
    //   let res = await axios.post(apiURL, {
    //     fingerprint: '860858352775069716.iKrLWlYLj_GoTtd8MPCWria5RHI',
    //     email: 'example@gmail.com',
    //     username: 'example',
    //     password: 'example',
    //     invite: null,
    //     consent: true,
    //     date_of_birth: '1995-06-04',
    //     gift_code_sku_id: null,
    //     captcha_key: data,
    //   });
    // } catch (error) {
    //   console.log(error);
    //   throw new Error('Failed to confirm capcha' + error);
    // }

    return data;
  }
}
