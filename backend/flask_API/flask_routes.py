from flask import Flask, json, request, jsonify, make_response, abort
from flask_cors import CORS
from datetime import datetime
from authentication import google_auth_verify, jwt_auth
from mysql_db_access import mysql_connection, jwt_authdb
import resource_methods
import auth_methods

app = Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

# default route
@app.route('/api/users/login', methods=['POST'])
def createUser():
    """
    Create a new user
    or sign in an existing user

    returns a json object true or false about user existance
    returns jwt token for user
    """
    result = auth_methods.AuthorizeUser(request)
    try:
        resp = None
        if result['user_exists'] == None:
            return make_response(jsonify(result), 401)
        else:
            jwt_token = result['token']
            del result['token']

            resp = make_response(result, 200)
            resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
            resp.headers['X-JWT'] = jwt_token

            return resp
    except Exception as e:
        return make_response(jsonify({'Error': str(e)}), 401)

@app.route('/api/users/username', methods=['PUT'])
def updateUserData():
    """
    Update user data
    """
    try:
        return make_response(jsonify({"error": "you are so bad at coding"}), 401)
        auth_methods.AuthenticateUser(request.headers)
        
        request_body = request.json

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}, 400)

@app.route('/api/users', methods=['GET'])


@app.route('/api/users/banned-usernames', methods=['GET'])
def getBannedUsernames():

    try:
        new_jwt_token = auth_methods.AuthenticateUser(request.headers)

        if new_jwt_token == False:
            return jsonify({"error": "Invalid Token"}, 401)
        
        banned_words = resource_methods.getBannedUsernames()
        resp = make_response(jsonify({'banned_words': banned_words}), 200)
        resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
        resp.headers['X-JWT'] = new_jwt_token
        return resp
    except Exception as e:
        return make_response(jsonify({'error': [str(e)]}), 401)
        
    
app.run()