
import request from '../../utils/request';
import config from '../config';
const ad = config.httpServer + '/services/FyFriendMngSvc';
export async function queryFriend(params) {
  return request(`${ad}/queryFriend`, params);
}
export async function confirmSign(params) {
  return request(`${ad}/confirmSign`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function removeFriend(params) {
  return request(`${ad}/removeFriend`, {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addFriend(params) {
  return request(`${ad}/addFriend`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
