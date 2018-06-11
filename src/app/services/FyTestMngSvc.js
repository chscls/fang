import { stringify } from 'qs';
import request from '../../utils/request';
import config from '../config';
const ad = config.httpServer + '/services/FyTestMngSvc';
export async function queryTest(params) {
  return request(`${ad}/queryTest`, params);
}
export async function findTest(params) {
  return request(`${ad}/findTest`, params);
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

export async function updateTestQuestions(params) {
  return request(`${ad}/updateTestQuestions`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
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
