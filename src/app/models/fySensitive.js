import { querySensitive, removeSensitive, addSensitive } from '../services/FySensitiveMngSvc';

export default {
  namespace: 'fySensitive',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySensitive, payload);
      yield put({
        type: 'suc',
        payload: {
          list: response.list,
          pagination: {
            pageSize: response.pageSize,
            current: response.pageNo,
            total: response.totalCount,
          },
        },
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addSensitive, payload);
      if (response) {
        yield put({
          type: 'nom',
          payload: response,
        });

        if (callback) callback({ suc: true, obj: response });
      } else {
        if (callback) callback({ suc: false, obj: payload });
      }
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeSensitive, payload);
      yield put({
        type: 'nom',
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
    nom(state, action) {
      return {
        ...state,
      };
    },
  },
};
