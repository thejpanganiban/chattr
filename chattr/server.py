from gevent import monkey; monkey.patch_all()
from flask import Flask, request, render_template

from socketio import socketio_manage
from socketio.mixins import BroadcastMixin
from socketio.namespace import BaseNamespace
from socketio.server import SocketIOServer


app = Flask(__name__, template_folder='views')


class ChatNamespace(BaseNamespace, BroadcastMixin):

  def on_chat(self, message):
    self.broadcast_event('chat', message)


@app.route('/')
def index():
  return render_template('index.html')


@app.route('/socket.io/<path:path>')
def handle_socketio(path):
  socketio_manage(request.environ, {'/chat': ChatNamespace})


def run():
  SocketIOServer(('0.0.0.0', 62001), app).serve_forever()
