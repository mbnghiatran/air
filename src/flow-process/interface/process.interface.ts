import { ChromiumWebDriver } from 'selenium-webdriver';
import { AgentXAutomation, AlphabotTaskAutomation, CommonPlatformAutomation, DcomAutomation, MetamaskAutomate, SuiWalletAutomate } from '../../auto';

export interface IProcessService {
  driver: ChromiumWebDriver;

  //Extension Service
  metamaskAutomation: MetamaskAutomate;
  agentXAutomation: AgentXAutomation;
  suiWalletAutomation: SuiWalletAutomate;

  //Platform Service
  platformAutomation: CommonPlatformAutomation;
  alphabotAutomation: AlphabotTaskAutomation;

  //DCOM Service
  dcomAutomation: DcomAutomation;

  handleOpenConfigNopecha: () => Promise<void>;
  handleDcomAutomation: () => Promise<void>;
  handleAutomationTask: () => Promise<void>;
  handleCreateWalletMetamask: (index: number) => Promise<void>;
}
