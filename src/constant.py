from enum import Enum
import platform

is_windows = platform.system() == 'Windows'

class EExtensionName(Enum):
    NOPECHA = 'nopecha'
    METAMASK = 'metamask'
    PHANTOM = 'phantom'
    SUI = 'sui'
    SUIET = 'suiet'
    ARGENT_X = 'argent-x'
    TWOCAPCHA = 'twocapcha'

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

IExtension = {
    "metamask": Extension({
        "id": 'nkbihfbeogaeaoehlefnkodbefgpgknn',
        "name": "metamask",
        "fileName": 'metamask.crx',
        "page": 'home.html',
        "installManual": True,
    }),
    "nopecha": Extension({
        "id": 'dknlfmjaanfblgfdfebhijalfmhmjjjo',
        "name": "nopecha",
        "fileName": 'nopecha.crx',
        "page": 'home.html',
        "installManual": False,
    }),
    "twocapcha": Extension({
        "id": 'ifibfemgeogfhoebkmokieepdoobkbpo',
        "name": "twocapcha",
        "fileName": 'twocapcha.crx',
        "page": 'home.html',
        "installManual": False,
    }),
} 