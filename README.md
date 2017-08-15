# pingpongfy-firebase

[![Build Status](https://travis-ci.org/vicente-valls/pingpongfy-firebase.svg?branch=master)](https://travis-ci.org/vicente-valls/pingpongfy-firebase)

## Requirements
* nvm
* node `v6.11.1`

## Installation
```
$ nvm use
$ npm install -g firebase-tools
$ cd functions && npm install
```


## Testing
```
$ npm test
```

## Deployment
By default you will deploy the api into your dev env as defined on `.firebaserc`
```
$ firebase login
$ firebase deploy --only functions:api
```
