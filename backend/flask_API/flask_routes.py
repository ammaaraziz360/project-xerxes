from flask import Flask, json, request, jsonify, make_response, abort

app = Flask(__name__)
app.config["DEBUG"] = True

# default route
@app.route('/', methods=['GET'])
def home():
    return '<h1>This is the REST API for Project Xerxes</h1>'

app.run()