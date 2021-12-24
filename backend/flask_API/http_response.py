
from flask import jsonify, make_response
from http_type_enum import HTTPTypes


class HTTPResponse():
    
    def __init__(self, Result=None, JWTAuthResult=None, HTTPType: HTTPTypes=HTTPTypes.NONE) -> None:
        self.ResponseResult = Result
        self.AuthResult = JWTAuthResult
        self.Type = HTTPType

    def CreateResponse(self):
        if(self.Type == HTTPTypes.GET_Protected):
            return self.__GET_Protected_Response()
        elif(self.Type == HTTPTypes.GET_Unprotected):
            return self.__GET_Unprotected_Response()
        elif(self.Type == HTTPTypes.POST):
            return self.__POST_Response()
        elif(self.Type == HTTPTypes.PUT):
            return self.__PUT_Response()
        elif(self.Type == HTTPTypes.DELETE):
            return self.__DELETE_Response()

    def __GET_Protected_Response(self):
        resp = None

        if(self.AuthResult["Valid"] == False):
            resp = make_response(jsonify({}), 401)
        elif(self.ResponseResult != {}):
            resp = make_response(jsonify(self.ResponseResult), 200)
            self.__JWTInjection(resp)
        else:
            resp = make_response(jsonify({"error": "Access is forbidden"}), 403)
            self.__JWTInjection(resp)

        return resp

    def __GET_Unprotected_Response(self):
        resp = None

        if(self.ResponseResult != {}):
            resp = make_response(jsonify(self.ResponseResult), 200)
            self.__JWTInjection(resp)
        else:
            resp = make_response(jsonify({"error": "Something went wrong"}), 404)
            self.__JWTInjection(resp)

        return resp
    
    def __POST_Response(self):
        resp = None

        if(self.AuthResult["Valid"] == False):
            resp = make_response(jsonify({}), 401)
        elif(self.ResponseResult == True):
            resp = make_response(jsonify({}), 200)
            self.__JWTInjection(resp)
        else:
            resp = make_response(jsonify({"error": "Something went wrong"}), 400)
            self.__JWTInjection(resp)

        return resp

    def __PUT_Response(self):
        resp = None

        if(self.AuthResult["Valid"] == False):
            resp = make_response(jsonify({}), 401)
        elif(self.ResponseResult == True):
            resp = make_response(jsonify({}), 200)
            self.__JWTInjection(resp)
        else:
            resp = make_response(jsonify({"error": "Something went wrong"}), 400)
            self.__JWTInjection(resp)

        return resp

    def __DELETE_Response(self):
        resp = None

        if(self.AuthResult["Valid"] == False):
            resp = make_response(jsonify({}), 401)
        elif(self.ResponseResult == True):
            resp = make_response(jsonify({}), 200)
            self.__JWTInjection(resp)
        else:
            resp = make_response(jsonify({"error": "Something went wrong"}), 400)
            self.__JWTInjection(resp)

        return resp

    def __JWTInjection(self, response):
        if(self.AuthResult["JWT"] != None and self.AuthResult["Valid"] == True):
            response.headers['Access-Control-Expose-Headers'] = 'X-JWT'
            response.headers['X-JWT'] = self.AuthResult["JWT"]
