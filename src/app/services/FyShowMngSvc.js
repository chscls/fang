import { stringify } from 'qs';
import request from '../../utils/request';
import config from '../config';
const ad = config.httpServer + '/services/FyShowMngSvc';
export async function query(params) {
  return request(`${ad}/query`, params);
}
export async function find(params) {
  return request(`${ad}/find`, params);
}

export async function remove(params) {
  return request(`${ad}/remove`, {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addCatalog(params) {
  return request(`${ad}/addCatalog`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function add(params) {
  return request(`${ad}/add`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
