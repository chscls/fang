import { stringify } from 'qs';
import request from '../../utils/request';
import config from '../config';
const ad = config.httpServer + '/services/FyGroupMngSvc';
export async function queryGroup(params) {
  return request(`${ad}/queryGroup`, params);
}

export async function removeGroup(params) {
  return request(`${ad}/removeGroup`, {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addGroup(params) {
  return request(`${ad}/addGroup`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
