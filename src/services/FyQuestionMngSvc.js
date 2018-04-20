import { stringify } from 'qs';
import request from '../utils/request';
import config from '../config';
const ad = config.server + '/services/FyQuestionMngSvc';
export async function queryQuestion(params) {
  return request(`${ad}/queryQuestion`,params);
}

export async function removeQuestion(params) {
  return request(`${ad}/removeQuestion`, {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addQuestion(params) {

  return request(`${ad}/addQuestion`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
