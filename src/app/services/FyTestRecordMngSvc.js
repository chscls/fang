import { stringify } from 'qs';
import request from '../../utils/request';
import config from '../config';
const ad = config.httpServer + '/services/FyTestRecordMngSvc';
export async function queryTestRecord(params) {
  return request(`${ad}/queryTestRecord`, params);
}

export async function queryMyTestRecord(params) {
  return request(`${ad}/queryMyTestRecord`, params);
}


export async function queryTestRecordDetail(params) {
  return request(`${ad}/queryTestRecordDetail`, params);
}

export async function findTestRecord(params) {
  return request(`${ad}/findTestRecord`, params);
}
export async function removeTestRecord(params) {
  return request(`${ad}/removeTestRecord`, {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addTestRecord(params) {
  return request(`${ad}/addTestRecord`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
