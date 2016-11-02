import { AsyncStorage, Linking } from 'react-native';
import * as querystring from 'query-string';
import uuid from 'react-native-uuid';
import {decodeToken} from './util';

class TokenStorage {
  constructor(key) { 
    this.key = key;
  }

  saveTokens(tokens) {
    return AsyncStorage.setItem(this.key, JSON.stringify(tokens));
  }

  loadTokens() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.key).then(value => resolve(JSON.parse(value)));
    });
  }

  clearTokens() {
    return AsyncStorage.removeItem(this.key);
  }
}

class Login {
  constructor() {
    this.state = {};
    this.onOpenURL = this.onOpenURL.bind(this);
    Linking.addEventListener('url', this.onOpenURL);
  }

  tokens() {
    return this.tokenStorage.loadTokens();
  }

  start(conf) {
    this.conf = conf;
    return new Promise(function(resolve, reject) {
      const {url, state} = this.getLoginURL();
      this.state = {
        ...this.state,
        resolve,
        reject,
        state,
      };

      Linking.openURL(url);
    }.bind(this));
  }

  end() {
    return this.tokenStorage.clearTokens();
  }

  onOpenURL(event) {
    if(event.url.startsWith(this.conf.appsite_uri)) {
      const {state, code} = querystring.parse(querystring.extract(event.url));
      if(this.state.state === state) {
        this.retrieveTokens(code);
      }
    }
  }

  retrieveTokens(code) {
    const {redirect_uri, client_id} = this.conf;
    const url = this.getRealmURL() + '/protocol/openid-connect/token';

    const headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    const body = querystring.stringify({
      grant_type: 'authorization_code',
      redirect_uri,
      client_id,
      code
    });

    fetch(url, {method: 'POST', headers, body}).then(response => {
      response.json().then(json => {
        if(json.error) {
          this.state.reject(json);
        } else {
          this.tokenStorage.saveTokens(json);
          this.state.resolve(json);
        }
      });
    });
  }

  decodeToken(token) {
    return decodeToken(token);
  }

  getRealmURL() {
    const {url, realm} = this.conf;
    const slash = url.endsWith('/') ? '' : '/';
    return url + slash + 'realms/' + encodeURIComponent(realm);
  }

  getLoginURL() {
    const {redirect_uri, client_id, kc_idp_hint} = this.conf;
    const response_type = 'code';
    const state = uuid.v4();
    const url = this.getRealmURL() + '/protocol/openid-connect/auth?' + querystring.stringify({
      kc_idp_hint,
      redirect_uri,
      client_id,
      response_type,
      state,
    });

    return {url, state};
  }

  setTokenStorage(tokenStorage) {
    this.tokenStorage = tokenStorage;
  }
}

const login = new Login();
login.setTokenStorage(new TokenStorage('react-native-token-storage'));

export default login;
