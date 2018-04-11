import { queryUser, removeUser, addUser } from '../services/KfUserMngSvc';

export default {
  namespace: 'kfUser',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUser, payload);
      yield put({
        type: 'suc',
        payload:{
            list: response.body.list,
            pagination: {
              pageSize:response.body.pageSize,
              current:response.body.pageNo,
              total:response.body.totalCount
            }, 
        } ,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addUser, payload);
      yield put({
        type: 'suc',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeUser, payload);
      yield put({
        type: 'suc',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    suc(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
