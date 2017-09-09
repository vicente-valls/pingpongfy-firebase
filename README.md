# pingpongfy-firebase

[![Build Status](https://travis-ci.org/vicente-valls/pingpongfy-firebase.svg?branch=master)](https://travis-ci.org/vicente-valls/pingpongfy-firebase) [![BCH compliance](https://bettercodehub.com/edge/badge/vicente-valls/pingpongfy-firebase?branch=master)](https://bettercodehub.com/)

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

#### Development

While working on the project you can release to your dev env as defined in: `.firebaserc`
```
$ firebase login
$ firebase use development
$ firebase deploy --only functions:api
```

#### Staging & Production
Releases with prefix `stg` or `prod` deploy api automatically from travis.
