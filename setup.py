from setuptools import setup
import chattr

packages = ['chattr']

install_requires = [
  'flask==0.9',
  'gunicorn >= 0.14.0, < 0.15.0',
  'gevent-socketio >= 0.3.5, < 0.4.0',
]

console_scripts = [
  'chattr.run = chattr.server:run',
]

entry_points = {
  'console_scripts': console_scripts,
}


setup(name="chattr",
      description="A chat demonstration with flask and gevent-socketio",
      version=chattr.__version__,
      author=chattr.__author__,
      packages=packages,
      entry_points=entry_points,
      install_requires=install_requires,
      )
