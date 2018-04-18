import { stringify } from 'qs';
import request from '../utils/request';
import config from '../config';
const ad = config.server + '/services/FyUserMngSvc';
export async function queryUser(params) {
  return request(`${ad}/queryUser`,params);
}

export async function removeUser(params) {
  return request(`${ad}/removeUser`, {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addUser(params) {
  return request(`${ad}/addUser`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
