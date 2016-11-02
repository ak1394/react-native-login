# React Native Login

React Native Login is a module for [React Native](https://facebook.github.io/react-native/) for implementing lightweight universal authentication using [Keycloak](http://keycloak.org)


## Documentation

- [Install](https://github.com/naoufal/react-native-login#install)
- [Usage](https://github.com/naoufal/react-native-login#usage)
- [Example](https://github.com/naoufal/react-native-login#example)
- [License](https://github.com/naoufal/react-native-login#license)

## Install

```shell
npm install --save react-native-login
```

## Usage

### App configuration

Please configure [Linking](https://facebook.github.io/react-native/docs/linking.html) module, including steps for handling Universal links.

Also, add applinks:<APPSITE HOST> entry to Associated Domains Capability of your app.


### Imports

```js
import Login from 'react-native-login';
```

### Checking if user is logged in

```js
Login.tokens().then(tokens => {
  console.log(tokens);
});

// Prints:
//
// { access_token: '...', refresh_token: '...', id_token: '...', ...}
```

### Login

```js

const config = {
  url: 'https://<KEYCLOAK_HOST>/auth',
  realm: '<REALM NAME>',
  client_id: '<CLIENT ID>',
  redirect_uri: 'https://<REDIRECT HOST>/success.html',
  appsite_uri: 'https://<APPSITE HOST>/app.html',
  kc_idp_hint: 'facebook',
};

Login.start(config).then(tokens => {
  console.log(tokens);
});

// Prints:
//
// { access_token: '...', refresh_token: '...', id_token: '...', ...}
```

Initiates login flow. Upon successfull completion, saves and returns a set of tokens.

### Logout

```js
Login.end();
```

Removes stored tokens. Subsequent calls to Login.tokens() will return null.

## Example

Please see the example app [react-native-login-example] https://github.com/ak1394/react-native-login-example

## License

The MIT License (MIT)
=====================

Copyright © `2016` `Anton Krasovsky`

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
