import { stringify } from 'qs';
import request from '../utils/request';
import config from '../config';
const ad = config.server + '/services/FyTestMngSvc';
export async function queryTest(params) {
  return request(`${ad}/queryTest`, params);
}

export async function removeTest(params) {
  return request(`${ad}/removeTest`, {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addTest(params) {
  return request(`${ad}/addTest`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
