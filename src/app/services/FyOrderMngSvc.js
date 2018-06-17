import { stringify } from 'qs';
import request from '../../utils/request';
import config from '../config';
const ad = config.httpServer + '/services/FyOrderMngSvc';
export async function queryOrder(params) {
  return request(`${ad}/queryOrder`, params);
}

export async function removeOrder(params) {
  return request(`${ad}/removeOrder`, {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addOrder(params) {
  return request(`${ad}/addOrder`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
