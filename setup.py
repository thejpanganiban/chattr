from setuptools import setup
import chattr

packages = ['chattr']

install_requires = [
  'flask==0.9',
  'gevent-socketio',
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
