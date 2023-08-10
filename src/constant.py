
from enum import Enum


class EExtensionName(Enum):
    NOPE_CHA = 'nope-cha'
    META_MASK = 'meta-mask'
    PHANTOM = 'phantom'
    SUI = 'sui'
    SUIET = 'suiet'
    ARGENT_X = 'argent-x'
    TWOCAPCHA = 'two-capcha'

class EPlatformName(Enum):
    PREMINT = 'premint'
    ALPHABOT = 'alphabot'

class ESocial(Enum):
    TWITTER = 'twitter'

class ETaskType(Enum):
    follow = 'follow'
    tweet = 'tweet'
    join = 'join'

class EFlowNumber(Enum):
    CLONE_PORTABLE = 1
    LOGIN_GOOGLE = 2
    LOGIN_DISCORD_AND_TWITTER = 3
    CREATE_WALLET_METAMASK = 4
    EXPORT_ACCOUNT_DATA_AND_WALLET = 5
    PRINT_ACCOUNT_RESOURCE = 6
    QUIT = 99

class Extension:
    def __init__(self, info:dict):
        for key in info:
            setattr(self, key, info.get(key))

IExtension = [ 
    Extension({
        "id": 'dknlfmjaanfblgfdfebhijalfmhmjjjo',
        "name": EExtensionName.NOPE_CHA,
        "fileName": 'nopecha.crx',
        "page": 'home.html',
        "installManual": False,
    }),
    Extension({
        "id": 'ifibfemgeogfhoebkmokieepdoobkbpo',
        "name": EExtensionName.TWOCAPCHA,
        "fileName": 'twocapcha.crx',
        "page": 'home.html',
        "installManual": False,
    }),
    Extension({
        "id": 'nkbihfbeogaeaoehlefnkodbefgpgknn',
        "name": EExtensionName.META_MASK,
        "fileName": 'meta_mask.crx',
        "page": 'home.html',
        "installManual": True,
    }),
    Extension({
        "id": 'bfnaelmomeimhlpmgjnjophhpkkoljpa',
        "name": EExtensionName.PHANTOM,
        "fileName": 'phantom.crx',
        "page": 'home.html',
        "installManual": False,
    }),
    Extension({
        "id": 'dlcobpjiigpikoobohmabehhmhfoodbb',
        "name": EExtensionName.ARGENT_X,
        "fileName": 'argent_x.crx',
        "page": 'lock-screen',
        "installManual": False,
    }),
    Extension({
        "id": 'opcgpfmipidbgpenhmajoajpbobppdil',
        "name": EExtensionName.SUI,
        "fileName": 'sui_wallet.crx',
        "page": 'ui.html',
        "installManual": False,
    }),
    Extension({
        "id": 'khpkpbbcccdmmclmpigdgddabeilkdpd',
        "name": EExtensionName.SUIET,
        "fileName": 'suiet_wallet.crx',
        "page": 'home.html',
        "installManual": False,
    }),
]