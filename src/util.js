import base64 from 'base-64';

export function decodeToken(token) {
  let str = token.split('.')[1];

  str = str.replace('/-/g', '+');
  str = str.replace('/_/g', '/');
  switch (str.length % 4) {
    case 0:
    break;
    case 2:
      str += '==';
    break;
    case 3:
      str += '=';
    break;
    default:
      throw 'Invalid token';
  }

  str = (str + '===').slice(0, str.length + (str.length % 4));
  str = str.replace(/-/g, '+').replace(/_/g, '/');

  str = decodeURIComponent(escape(base64.decode(str)));

  str = JSON.parse(str);
  return str;
}
