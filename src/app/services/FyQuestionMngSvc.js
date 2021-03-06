import { stringify } from 'qs';
import request from '../../utils/request';
import config from '../config';
const ad = config.httpServer + '/services/FyQuestionMngSvc';
export async function updateQuestionQuestions(params) {
  return request(`${ad}/updateQuestionQuestions`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function queryQuestion(params) {
  return request(`${ad}/queryQuestion`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function queryQuestionRe(params) {
  return request(`${ad}/queryQuestionRe`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function findQuestion(params) {
  return request(`${ad}/findQuestion`, params);
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
export async function recoveryQuestion(params) {
  return request(`${ad}/recoveryQuestion`, {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}


export async function recycleQuestion(params) {
  return request(`${ad}/recycleQuestion`, {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function updateOptions(params) {
  return request(`${ad}/updateOptions`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
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
