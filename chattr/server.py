from gevent import monkey; monkey.patch_all()
from flask import Flask, request, render_template

from socketio import socketio_manage
from socketio.mixins import BroadcastMixin
from socketio.namespace import BaseNamespace
from socketio.server import SocketIOServer

from pymongo import Connection

import time
import json


app = Flask(__name__, template_folder='views')
app.config['DATABASE'] = 'chattr'


conn = Connection(use_greenlets=True)
db = conn[app.config['DATABASE']]


class ChatNamespace(BaseNamespace, BroadcastMixin):

  def on_chat(self, message):
    message.update({'time': time.time()})
    db.messages.insert(message)
    message.update({'_id': str(message.get('_id'))})
    self.broadcast_event('chat', message)


@app.route('/')
def index():
  messages = []
  for message in db.messages.find():
    message.update({'_id': str(message.get('_id'))})
    messages.append(message)
  return render_template('index.html', messages=unicode(json.dumps(messages)))


@app.route('/socket.io/<path:path>')
def handle_socketio(path):
  socketio_manage(request.environ, {'/chat': ChatNamespace})


def run():
  SocketIOServer(('0.0.0.0', 62001), app).serve_forever()
