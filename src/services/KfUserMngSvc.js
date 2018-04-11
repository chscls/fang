import { stringify } from 'qs';
import request from '../utils/request';
import config from '../config';
const ad = config.server+'/soa/services/KfUserMngSvc'
export async function queryUser(params) {
    return request(`${ad}/queryUser?${stringify(params)}`);
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
    console.log(params)
    return request(`${ad}/addUser`, {
      method: 'POST',
      body: {
        ...params,
        method: 'post',
      },
    });
  }