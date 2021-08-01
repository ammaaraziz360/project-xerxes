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
            session_id = result['session_id']
            resp = make_response(result, 200)
            resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
            resp.headers['X-JWT'] = jwt_token
            return resp
    except Exception as e:
        return make_response(jsonify({'Error': str(e)}), 401)

@app.route('/api/users', methods=['PUT'])
def updateUserData():
    """
    Update user data
    """
    try:
        new_jwt_token = auth_methods.AuthenticateUser(request.headers)
        if new_jwt_token == False:
            return make_response(jsonify({"error": "Invalid Token"}), 401)

        user_dict = {
            'User_id': None,
            'username': None,
            'first_name': None, 
            'last_name': None, 
            'pfp_url': None,  
            'bio': None, 
            'location': None,
        }
        user_dict['User_id'] = request.headers['user_id']        
        request_body = request.json

        for key, value in request_body.items():
            user_dict[key] = value

        result = resource_methods.UpdateUser(user_dict)
        if result != True:
            if new_jwt_token != True:
                resp = make_response(jsonify({"error": result}), 400)
                resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
                resp.headers['X-JWT'] = new_jwt_token
            else:
                resp = make_response(jsonify({"error": result}), 400)
            return resp
        else:
            if new_jwt_token != True:
                resp = make_response(jsonify({"message": "User updated successfully"}), 200)
                resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
                resp.headers['X-JWT'] = new_jwt_token
            else:
                resp = make_response(jsonify({"message": "User updated successfully"}), 200)
            return resp
        
    except Exception as e:
        return jsonify({"error": str(e)}, 400)

@app.route('/api/users/authenticate', methods=['GET'])
def AuthenticateUser():
    """
    Authenticate user
    """
    try:
        new_jwt_token = auth_methods.AuthenticateUser(request.headers)
        if new_jwt_token == False:
            return make_response(jsonify({"error": "Invalid Token"}), 401)
        
        resp = make_response(jsonify({"message": "User authenticated successfully"}), 200)

        if new_jwt_token != True:
            resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
            resp.headers['X-JWT'] = new_jwt_token

        return resp
    except Exception as e:
        return jsonify({"error": str(e)}, 400)

@app.route('/api/users/banned-usernames', methods=['GET'])
def getBannedUsernames():

    try:
        new_jwt_token = auth_methods.AuthenticateUser(request.headers)

        if new_jwt_token == False:
            return make_response(jsonify({"error": "Invalid Token"}), 401)
        
        banned_words = resource_methods.getBannedUsernames()
        resp = make_response(jsonify({'banned_words': banned_words}), 200)
        if new_jwt_token != True:
            resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
            resp.headers['X-JWT'] = new_jwt_token
        return resp
    except Exception as e:
        return make_response(jsonify({'error': [str(e)]}), 401)
    
    
@app.route('/api/users/logout', methods=['POST'])
def logoutUser():
    """
    Logout user
    """
    try:
        new_jwt_token = auth_methods.AuthenticateUser(request.headers)

        if new_jwt_token == False:
            return make_response(jsonify({"error": "Invalid Token"}), 401)
        
        result = auth_methods.LogoutUser(request.headers)
        if result == True:
            resp = make_response(jsonify({"message": "User logged out successfully"}), 200)
        return resp
    except Exception as e:
        print(e)
        return make_response(jsonify({'error': [str(e)]}), 401)
    
@app.route('/api/users/profile', methods=['GET'])
def getUserProfile():
    """
    Get user profile
    """
    try:
        new_jwt_token = auth_methods.AuthenticateUser(request.headers)

        if new_jwt_token == False:
            return make_response(jsonify({"error": "Invalid Token"}), 401)
        
        user_id = request.headers['user_id']
        user_dict = resource_methods.getUserProfile(user_id)
        if user_dict == None:
            return make_response(jsonify({"error": "User not found"}), 404)
        resp = make_response(jsonify(user_dict), 200)
        if new_jwt_token != True:
            resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
            resp.headers['X-JWT'] = new_jwt_token
        print(user_dict)
        return resp
    except Exception as e:
        return make_response(jsonify({'error': str(e)}), 401)


@app.route('/api/users/socials', methods=['PUT'])
def updateUserSocials():
    """
    Update user socials
    """
    try:
        new_jwt_token = auth_methods.AuthenticateUser(request.headers)

        if new_jwt_token == False:
            return make_response(jsonify({"error": "Invalid Token"}), 401)
        
        result = resource_methods.editUserSocials(request.headers['user_id'], request.json)

        if result != True:
            return make_response(jsonify({"error": result}), 400)
        resp = make_response(jsonify("Socials updated sucessfully"), 200)
        if new_jwt_token != True:
            resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
            resp.headers['X-JWT'] = new_jwt_token

        return resp
    except Exception as e:
        return make_response(jsonify({'error': str(e)}), 401)


app.run()