import dotenv from 'dotenv';
//setup env
dotenv.config();

import logger from './logger';
import { getFlowNumber } from './readline';
import { EFlowNumber } from './constant';
import { FlowService } from './flow-process';
import MESSAGE_LOGGER from './logger/message';
import { THROW_ERROR_PROBLEM } from './utils';

async function build(): Promise<void> {
  let flowNumber = 0;

  // @description: run until user quit
  while (flowNumber !== EFlowNumber.QUIT) {
    try {
      flowNumber = await getFlowNumber();
    } catch (error: any) {
      logger.error(MESSAGE_LOGGER.GET_READLINE_HAVE_PROBLEM + error);
      return;
    }
    logger.info('You run flow number: ' + flowNumber);

    const flowService: FlowService = new FlowService();

    try {
      switch (flowNumber) {
        // 1. Clone portable
        case EFlowNumber.CLONE_PORTABLE:
          await flowService.runClonePortable();
          break;
        // 2. Run portable
        case EFlowNumber.LOGIN_GOOGLE:
          await flowService.runGoogleLogin();
          break;
        // 3. Login discord and twitter
        case EFlowNumber.LOGIN_DISCORD_AND_TWITTER:
          await flowService.runLoginDiscordTwitter();
          break;
        // 4. Create wallet metamask
        case EFlowNumber.CREATE_WALLET_METAMASK:
          await flowService.runCreateWalletMetamask();
          break;
        case EFlowNumber.EXPORT_ACCOUNT_DATA_AND_WALLET:
          await flowService.runExportAccountDataAndWallet();
          break;
        case EFlowNumber.PRINT_ACCOUNT_RESOURCE:
          await flowService.runPrintAccountResource();
          break;
        case EFlowNumber.QUIT:
          logger.info('You quit program');
          return;
      }
    } catch (error) {
      THROW_ERROR_PROBLEM(`Error flow number: ${flowNumber}` + error);
    }
    logger.info('Finish flow number: ' + flowNumber);

    continue;
  }
}

build();
