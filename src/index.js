import {Linking} from 'react-native';

import * as querystring from 'query-string';
import uuid from 'react-native-uuid';
import {decodeToken} from './util';

// TODO track state transitions within Login instead of relying on external events
// TODO publish state transitions, extend event emitter?
export default class Login {
  constructor(conf) { 
    this.conf = conf;
    Linking.addEventListener('url', (event) => this.handleOpenURL(event));
  }

  start() {
    // start authentication flow
    Linking.openURL(this.getLoginUrl());
  }

  check() {
    // check if user has logged in, tokens are valid, etc
  }

  end() {
    // logout user
    // kill tokens?
  }

  handleOpenURL(event) {
    if(event.url.startsWith(this.conf.success_uri)) {
      const {state, code} = querystring.parse(querystring.extract(event.url));
      this.retrieveTokens(code);
    }
  }

  retrieveTokens(code) {
    const {redirect_uri, client_id} = this.conf;
    const url = this.getRealmUrl() + '/protocol/openid-connect/token';

    const headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    const body = querystring.stringify({
      grant_type: 'authorization_code',
      redirect_uri,
      client_id,
      code
    });

    fetch(url, {method: 'POST', headers, body}).then(function(response) {
      response.json().then(function(json) {
        console.log('id token', decodeToken(json.id_token));
      });
    });
  }

  foo() {
    /*
    console.log('fetch userinfo');
    const headers1 = new Headers();
    headers1.append("Authorization", "Bearer " + json.access_token);
    headers1.append('Accept', 'application/json');
    const params1 = {method: 'GET', headers: headers1};
    fetch(userinfo, params1).then(response => response.json().then(json => console.log('userinfo', json)));
    fetch(account, params1).then(response => response.json().then(json => console.log('account', json)));
    */
  }

  getRealmUrl() {
    const {url, realm} = this.conf;
    const slash = url.endsWith('/') ? '' : '/';
    return url + slash + 'realms/' + encodeURIComponent(realm);
  }

  getLoginUrl() {
    const {redirect_uri, client_id, kc_idp_hint} = this.conf;
    const response_type = 'code';
    const state = uuid.v4();

    return this.getRealmUrl() + '/protocol/openid-connect/auth?' + querystring.stringify({
      kc_idp_hint,
      redirect_uri,
      client_id,
      response_type,
      state,
    });
  }
}
