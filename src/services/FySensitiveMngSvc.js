import { stringify } from 'qs';
import request from '../utils/request';
import config from '../config';
const ad = config.server + '/services/FySensitiveMngSvc';
export async function querySensitive(params) {
  return request(`${ad}/querySensitive`, params);
}

export async function removeSensitive(params) {
  return request(`${ad}/removeSensitive`, {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addSensitive(params) {
  return request(`${ad}/addSensitive`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
