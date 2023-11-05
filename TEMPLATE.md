## Manual
* https://loopback.io/doc/en/lb4/express-with-lb4-rest-tutorial.html

## Description
Create a loopback with express application using the loopback 4 cli.

## Try to start
* yarn run start
```
http://localhost:3000/
http://localhost:3000/api/

```

## Create money data directory
* mkdir -p /data
* touch /data/user-credentials-db.json
* pasete the following content
```
{
  "ids": {
    "User": 0,
    "UserCredentials": 0
  },
  "models": {
    "User": {},
    "UserCredentials": {}
  }
}
```
* yarn run start
* Singup a user
* Login and get token

## Try to get balance from polkadot
* Account: `1CfjMtuDadAuYFdTZTJHj7QWmQoEs7vxgeGG3dYigf8PGuT`

### Create a Polkadot
* lb4 controller (Empty controller) Polkadot

### Install polkadot/api
* yarn add @polkadot/api

## Other commands
* yarn run install
* yarn run build
* yarn run migrate


