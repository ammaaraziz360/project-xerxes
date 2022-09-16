from enum import Enum


class HTTPTypes(Enum):
    POST = 1
    GET_Protected = 2
    GET_Unprotected = 3
    PUT = 4
    DELETE = 5
    NONE = 6

class LoginType(Enum):
    GOOGLE_LOGIN = 1
    PASSWORD_LOGIN = 2