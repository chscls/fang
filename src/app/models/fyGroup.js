import { queryGroup, removeGroup, addGroup } from '../services/FyGroupMngSvc';

export default {
  namespace: 'fyGroup',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryGroup, payload);
      if(!response){yield put({type: 'nom'});return }
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
      const response = yield call(addGroup, payload);
      if(!response){yield put({type: 'nom'});return }
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
      const response = yield call(removeGroup, payload);
      if(!response){yield put({type: 'nom'});return }
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
