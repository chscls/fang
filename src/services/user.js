import request from '../utils/request';
import config from '../app/config';
const ad = config.server + '/services/FyUserMngSvc';
export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request(`${ad}/currentUser`);
}
