import chalk from 'chalk';

type TMessage =
  | 'GET_READLINE_HAVE_PROBLEM'
  | 'KILL_TERMINAL_HAVE_PROBLEM'
  | 'INITIALIZE_DRIVER_HAVE_PROBLEM'
  | 'INVALID_INPUT_NUMBER'
  | 'ACCOUNT_NOT_FOUND'
  | 'INVALID_ENDING_NUMBER_GREATER_THAN_STARTING_NUMBER'
  | 'GET_ACCOUNT_RESOURCE_HAVE_PROBLEM'
  | 'KILL_TERMINAL_CHROME_SUCCESS'
  | 'ALL_TAB_LOADED_SUCCESS'
  | 'FLOW_CLONE_PORTABLE'
  | 'FLOW_LOGIN_DISCORD_AND_TWITTER'
  | 'FLOW_CREATE_WALLET_METAMASK'
  | 'CLONE_PORTABLE_FROM_TEMPLATE'
  | 'ALL_EXTENSION_LOADED_SUCCESS'
  | 'LOAD_EXTENSION_SUCCESS'
  | 'CLONE_PORTABLE_SUCCESS'
  | 'HOW_MANY_YOU_WANT_CLONE'
  | 'YOU_NOT_SURE_DELETE_ALL_DATA_IN_FOLDER'
  | 'FLOW_INITIALIZE_PORTABLE'
  | 'FLOW_PRINT_ACCOUNT_RESOURCE'
  | 'INPUT_PORTABLE_START_NUMBER'
  | 'INPUT_PORTABLE_END_NUMBER'
  | 'PLEASE_WAITING'
  | 'COUNT_ACCOUNT_SUCCESS';

const MESSAGE_LOGGER: Record<TMessage, string> = {
  /** @description: ERROR */
  GET_READLINE_HAVE_PROBLEM: chalk.red('Get readline have problem: '),
  KILL_TERMINAL_HAVE_PROBLEM: chalk.red('Kill terminal chrome have problem at:'),
  INITIALIZE_DRIVER_HAVE_PROBLEM: chalk.red('Initialize driver have problem'),
  INVALID_INPUT_NUMBER: chalk.red('Invalid input. Please enter a number.'),
  INVALID_ENDING_NUMBER_GREATER_THAN_STARTING_NUMBER: chalk.red('Invalid ending number greater than starting number'),
  GET_ACCOUNT_RESOURCE_HAVE_PROBLEM: chalk.red('Get account resource have problem'),
  ACCOUNT_NOT_FOUND: chalk.red('Account not found'),

  /** @description: SUCCESS */
  CLONE_PORTABLE_SUCCESS: chalk.green('You clone portable success'),
  KILL_TERMINAL_CHROME_SUCCESS: chalk.green('Kill terminal chrome success'),
  ALL_TAB_LOADED_SUCCESS: chalk.green('All tab loaded success'),
  COUNT_ACCOUNT_SUCCESS: chalk.green('Get account resource success and count account:'),
  LOAD_EXTENSION_SUCCESS: chalk.green('Load extension {{EXTENSION_NAME}} success'),
  ALL_EXTENSION_LOADED_SUCCESS: chalk.green('All extension loaded success'),

  /** @description: WARNING */
  FLOW_CLONE_PORTABLE: chalk.blue('You clone portable to folder:'),
  HOW_MANY_YOU_WANT_CLONE: chalk.blue('How many portable you want clone? '),
  CLONE_PORTABLE_FROM_TEMPLATE: 'Clone portable from template:',
  YOU_NOT_SURE_DELETE_ALL_DATA_IN_FOLDER: 'You not sure delete all data in folder:',

  FLOW_INITIALIZE_PORTABLE: `You initialize portable at folder:`,
  FLOW_PRINT_ACCOUNT_RESOURCE: 'You print account resource at folder:',
  FLOW_LOGIN_DISCORD_AND_TWITTER: 'You login discord and twitter at folder:',
  FLOW_CREATE_WALLET_METAMASK: 'You create wallet metamask at folder:',

  INPUT_PORTABLE_START_NUMBER: chalk.blue('Input portable starting number: '),
  INPUT_PORTABLE_END_NUMBER: chalk.blue('Input portable ending number: '),

  PLEASE_WAITING: 'Please waiting .... It take a long time',
};

export default MESSAGE_LOGGER;
