import os

from flask import Flask, render_template, request, redirect, url_for, jsonify, send_file
from flask_socketio import SocketIO, emit
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
socketio = SocketIO(app)

channelList = {"channel1": []}

@app.route('/')
@app.route("/<errorCode>")
def channels(errorCode = None):
    return render_template("channels.html", channels=channelList.keys(), errorCode=errorCode)

@app.route("/channels", methods=['POST'])
def createChannel():
    channel = request.form.get('channel', None)
    channel = request.form.get('channel', None)

    if channel == None or channel.strip(" ") == "":
        return redirect(url_for('channels', errorCode=1))

    if channel in channelList:
        return redirect(url_for('channels', errorCode=2))

    channelList[channel] = []

    return redirect(url_for('channels'))

@app.route("/channels/<channel>")
def channel(channel):
    if channel not in channelList:
        return render_template("404.html"), 404
    return render_template("messages.html", channel=channel, messages=channelList[channel])

@app.route("/file-upload", methods=['POST'])
def fileUploads():
    if 'attachment' not in request.files:
        return jsonify({"status": False})

    file = request.files['attachment']

    if file.filename == '':
        return jsonify({"status": False})

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    return jsonify({"status": True})

@app.route('/download/<filename>')
def download(filename):
	path = "uploads/" + filename
	path = path.replace("../", "")

	return send_file(path, as_attachment=True)

@socketio.on("submit message")
def message(data):
    message = data["message"]
    createdAt = data["created_at"]
    channelName = data["channel"]

    if len(channelList[channelName]) >= 100:
        arr.pop(0)

    message = {"message": message, 'channel': channelName, "created_at": createdAt}

    if 'attachment' in data:
        message['attachment'] = data['attachment']

    channelList[channelName].append(data)
    emit("whisper message", data, broadcast=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if __name__ == '__main__':
    socketio.run(app)
