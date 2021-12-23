from backend.flask_API.http_response import HTTPResponse
from backend.flask_API.http_type_enum import HTTPTypes
from backend.flask_API.resource_methods import ResourceDB_API
from flask import Flask, json, request, jsonify, make_response, abort
from flask_cors import CORS
from datetime import datetime
from authentication import google_auth_verify, jwt_auth
from mysql_db_access import mysql_connection, jwt_authdb
import resource_methods
import auth_methods
import traceback

ResourceDatabase = ResourceDB_API()

app = Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

# default route
@app.route('/api/users/login', methods=['POST'])
def createUser():
    """
    Create a new user
    or sign in an existing user

    returns a json object true or false about user existence
    returns jwt token for user
    """
    result = auth_methods.AuthorizeUser(request)
    try:
        resp = None
        if result['user_exists'] == -1:
            return make_response(jsonify(result), 401)
        else:
            jwt_token = result['token']
            resp = make_response(result, 200)
            resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
            resp.headers['X-JWT'] = jwt_token
            return resp
    except Exception as e:
        print(traceback.print_exc())
        return make_response(jsonify({'Error': str(e)}), 401)

@app.route('/api/users', methods=['PUT'])
def updateUser():
    """
    Update user data
    """
    try:
        JWTResult = auth_methods.AuthenticateUser(request.headers)

        resp = HTTPResponse(JWTAuthResult=JWTResult, HTTPType=HTTPTypes.PUT)

        if resp.AuthResult["Valid"] == False:
            return resp.CreateResponse()

        user_dict = {
                        'user_id': None,                        
                        'username': None,
                        'first_name': None,
                        'last_name': None,
                        'email_address': None,
                        'pfp_url': None,
                        'location': None,
                        'bio': None,
                        'facebook_url': None,
                        'youtube_url': None,
                        'instagram_url': None,
                        'website_url': None,        
                    }

        user_dict['user_id'] = request.headers['user_id']        
        request_body = request.json

        for key, val in request_body.items():
            user_dict[key] = val
            
        result = ResourceDatabase.UpdateUser(user_dict)

        resp.ResponseResult = result

        return result

        # if result != True:
        #     if new_jwt_token != True:
        #         resp = make_response(jsonify({"error": result}), 400)
        #         resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
        #         resp.headers['X-JWT'] = new_jwt_token
        #     else:
        #         resp = make_response(jsonify({"error": result}), 400)
        #     return resp
        # else:
        #     if new_jwt_token != True:
        #         resp = make_response(jsonify({"message": "User updated successfully"}), 200)
        #         resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
        #         resp.headers['X-JWT'] = new_jwt_token
        #     else:
        #         resp = make_response(jsonify({"message": "User updated successfully"}), 200)
        #     return resp
        
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

# @app.route('/api/users/banned-usernames', methods=['GET'])
# def getBannedUsernames():

#     try:
#         new_jwt_token = auth_methods.AuthenticateUser(request.headers)

#         if new_jwt_token == False:
#             return make_response(jsonify({"error": "Invalid Token"}), 401)
        
#         banned_words = ResourceDatabase.getBannedUsernames()
#         resp = make_response(jsonify({'banned_words': banned_words}), 200)
#         if new_jwt_token != True:
#             resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
#             resp.headers['X-JWT'] = new_jwt_token
#         return resp
#     except Exception as e:
#         return make_response(jsonify({'error': [str(e)]}), 401)
    
    
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
    
@app.route('/api/users/profile/<username>', methods=['GET'])
def getUserProfile(username):
    """
    Get user profile
    """
    try:
        requester_id = None
        JWTResult = auth_methods.AuthenticateUser(request.headers)

        resp = HTTPResponse(JWTAuthResult=JWTResult, HTTPType=HTTPTypes.GET_Unprotected)

        if JWTResult["Valid"] != False:
            requester_id = request.headers['user_id']
        
        result = ResourceDatabase.getUserProfile(username, requester_id)

        resp.ResponseResult = result

        return resp.CreateResponse()

    except Exception as e:
        return make_response(jsonify({'error': str(e)}), 400)

@app.route('/api/users/profile', methods=['GET'])
def getLoggedInUserProfile():
    """
    Get logged in user profile
    """
    try:
        new_jwt_token = auth_methods.AuthenticateUser(request.headers)

        if new_jwt_token == False:
            return make_response(jsonify({"error": "Invalid Token"}), 401)
            
        requester_id = request.headers['user_id']
        user_dict = ResourceDatabase.getUserProfile(requester_id, requester_id)
        if user_dict == None:
            return make_response(jsonify({"error": "User not found"}), 404)
        resp = make_response(jsonify(user_dict), 200)

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
        
        result = ResourceDatabase.editUserSocials(request.headers['user_id'], request.json)

        if result != True:
            return make_response(jsonify({"error": result}), 400)
        resp = make_response(jsonify("Socials updated sucessfully"), 200)
        if new_jwt_token != True:
            resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
            resp.headers['X-JWT'] = new_jwt_token

        return resp
    except Exception as e:
        return make_response(jsonify({'error': str(e)}), 401)

@app.route('/api/posts', methods=['POST'])
def insertPost():
    """
    Add post
    """
    try:
        new_jwt_token = auth_methods.AuthenticateUser(request.headers)

        if new_jwt_token == False:
            return make_response(jsonify({"error": "Invalid Token"}), 401)
        
        result = ResourceDatabase.insertPost(request.headers['user_id'], request.json)
        if result != True:
            return make_response(jsonify({"error": "Post not added"}), 400)
        resp = make_response(jsonify({"message": "Post added successfully"}), 200)
        if new_jwt_token != True:
            resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
            resp.headers['X-JWT'] = new_jwt_token
        return resp
    except Exception as e:
        print(e)
        return make_response(jsonify({'error': str(e)}), 401)

@app.route('/api/posts/<post_id>/like', methods=['POST'])
def likePost(post_id):
    """
    Like or dislike post or unlike or undislike post
    """
    try:
        new_jwt_token = auth_methods.AuthenticateUser(request.headers)

        if new_jwt_token == False:
            return make_response(jsonify({"error": "Invalid Token"}), 401)
        
        result = ResourceDatabase.likePost(post_id, request.headers['user_id'], request.json)
        if result == True:
            resp = make_response(jsonify({"message": "Post liked successfully"}), 200)
        else:
            resp = make_response(jsonify({"error": "Post not liked"}), 400)
        if new_jwt_token != True:
            resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
            resp.headers['X-JWT'] = new_jwt_token
        return resp
    except Exception as e:
        return make_response(jsonify({'error': str(e)}), 401)

@app.route('/api/users/<follow_id>/follow', methods=['POST'])
def followUser(follow_id):
    """
    Follow or unfollow user
    """
    try:
        new_jwt_token = auth_methods.AuthenticateUser(request.headers)
        if new_jwt_token == False:
            return make_response(jsonify({"error": "Invalid Token"}), 401)
        
        result = ResourceDatabase.followUser(request.headers['user_id'], follow_id, request.json)
        if result == True:
            resp = make_response(jsonify({"message": "User followed successfully"}), 200)
        else:
            resp = make_response(jsonify({"error": "User not followed"}), 400)
        if new_jwt_token != True:
            resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
            resp.headers['X-JWT'] = new_jwt_token
        return resp
    except Exception as e:
        print(e)
        return make_response(jsonify({'error': str(e)}), 401)

@app.route('/api/posts/<post_id>', methods=['GET'])
def getPost(post_id):
    """
    Get post
    """
    try:
        requester_id = None
        JWTResult = auth_methods.AuthenticateUser(request.headers)

        if JWTResult["Valid"] == True:
            requester_id = request.headers['user_id']

        user_dict = ResourceDatabase.getPost(post_id, requester_id)

        resp = HTTPResponse(user_dict, JWTResult, HTTPTypes.GET_Unprotected)

        return resp.CreateResponse()

        # if user_dict == None:
        #     resp = make_response(jsonify({"error": "Post not found"}), 404)
        #     if(new_jwt_token != True or new_jwt_token != False):
        #         resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
        #         resp.headers['X-JWT'] = new_jwt_token
        # else:
        #     resp = make_response(jsonify(user_dict), 200)
        #     if(new_jwt_token != True or new_jwt_token != False):
        #         resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
        #         resp.headers['X-JWT'] = new_jwt_token

        # return resp
    except Exception as e:
        print(traceback.print_exc())
        return make_response(jsonify({'error': str(e)}), 401)

@app.route('/api/posts/<post_id>/comments', methods=['GET'])
def getPostComments(post_id):
    """
    Get post comments
    """
    try:
        requester_id = None
        new_jwt_token = auth_methods.AuthenticateUser(request.headers)

        if new_jwt_token != False:
            requester_id = request.headers['user_id']
        comments = ResourceDatabase.getPostComments(post_id, requester_id)
        if comments == None:
            resp = make_response(jsonify({"error": "Post not found"}), 404)
            if(new_jwt_token != True or new_jwt_token != False):
                resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
                resp.headers['X-JWT'] = new_jwt_token
        else:
            resp = make_response(jsonify(comments), 200)
            if(new_jwt_token != True or new_jwt_token != False):
                resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
                resp.headers['X-JWT'] = new_jwt_token

        return resp
    except Exception as e:
        print(traceback.print_exc())
        return make_response(jsonify({'error': str(e)}), 401)

@app.route('/api/user/<username>/followers', methods=['GET'])
def getUserFollowers(username):
    """
    Get user followers
    """
    try:
        requester_id = None
        new_jwt_token = auth_methods.AuthenticateUser(request.headers)

        if new_jwt_token != False:
            requester_id = request.headers['user_id']
        followers = ResourceDatabase.getUserFollowers(username, requester_id)
        if followers == None:
            resp = make_response(jsonify({"error": "User not found"}), 404)
            if(new_jwt_token != True or new_jwt_token != False):
                resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
                resp.headers['X-JWT'] = new_jwt_token
        else:
            resp = make_response(jsonify(followers), 200)
            if(new_jwt_token != True or new_jwt_token != False):
                resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
                resp.headers['X-JWT'] = new_jwt_token

        return resp
    except Exception as e:
        print(traceback.print_exc())
        return make_response(jsonify({'error': str(e)}), 401)

@app.route('/api/user/<username>/following', methods=['GET'])
def getUserFollowing(username):
    """
    Get user following
    """
    try:
        requester_id = None
        new_jwt_token = auth_methods.AuthenticateUser(request.headers)

        if new_jwt_token != False:
            requester_id = request.headers['user_id']
        following = ResourceDatabase.getUserFollowing(username, requester_id)
        if following == None:
            resp = make_response(jsonify({"error": "User not found"}), 404)
            if(new_jwt_token != True or new_jwt_token != False):
                resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
                resp.headers['X-JWT'] = new_jwt_token
        else:
            resp = make_response(jsonify(following), 200)
            if(new_jwt_token != True or new_jwt_token != False):
                resp.headers['Access-Control-Expose-Headers'] = 'X-JWT'
                resp.headers['X-JWT'] = new_jwt_token

        return resp
    except Exception as e:
        print(traceback.print_exc())
        return make_response(jsonify({'error': str(e)}), 401)


app.run(threaded=True)