export enum EExtensionName {
  NOPE_CHA = 'nope-cha',
  META_MASK = 'meta-mask',
  PHANTOM = 'phantom',
  SUI = 'sui',
  SUIET = 'suiet',
  ARGENT_X = 'argent-x',
  TWOCAPCHA = 'two-capcha',
}

export enum EPlatformName {
  PREMINT = 'premint',
  ALPHABOT = 'alphabot',
}

export enum ESocial {
  TWITTER = 'twitter',
}

export enum EElementType {
  id = 'id',
  css = 'css',
  className = 'className',
  js = 'js',
  linkText = 'linkText',
  name = 'name',
  partialLinkText = 'partialLinkText',
  tagName = 'tagName',
  xpath = 'xpath',
}

export enum ETaskType {
  follow = 'follow',
  tweet = 'tweet',
  join = 'join',
}

export enum EFlowNumber {
  CLONE_PORTABLE = 1,
  LOGIN_GOOGLE = 2,
  LOGIN_DISCORD_AND_TWITTER = 3,
  CREATE_WALLET_METAMASK = 4,
  EXPORT_ACCOUNT_DATA_AND_WALLET = 5,
  PRINT_ACCOUNT_RESOURCE = 6,
  QUIT = 99,
}
