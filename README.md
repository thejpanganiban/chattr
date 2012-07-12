#Chattr

Chat with strangers. A simple chat app that demonstrates gevent-socketio on flask with backbone.js.

##Requirements

    libevent-dev (if I recall it correctly; needed for gevent)

##Setup

    python setup.py develop

##Running

    chattr.run

It will run on host 0.0.0.0:53000 (or localhost:53000).

##Deployment

What currently runs the chattr.jpanganiban.com server is HAProxy + Nginx and
gunicorn. HAProxy checks if it's a regular connection or a websocket connection
then passes it to Nginx and to gunicorn respectively.

Another option would be to use Nginx and the [TCP Proxy Module][0].

Thing is: Nginx doesn't support websockets yet and it removes it in the headers
thus a KeyError (socketio\_manage method)

On Multiple Workers: You need to configure socketio to use RedisStore (haven't tried
it yet on gevent-socketio) as [https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO][1]


[0]: https://github.com/yaoweibin/nginx_tcp_proxy_module/
[1]: https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO]
