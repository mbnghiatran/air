export interface IFlowService {
  runClonePortable(): Promise<void>;
  runLoginDiscordTwitter(): Promise<void>;
  runPrintAccountResource(): Promise<void>;
  runExportAccountDataAndWallet(): Promise<void>;
}
