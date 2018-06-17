import { queryUser, removeUser, addUser } from '../services/FyUserMngSvc';

export default {
  namespace: 'fyUser',

  state: {
    mdata: {
      list: [],
      pagination: {},
    },
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUser, payload);
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: payload.type,
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
      const response = yield call(addUser, payload);
      if(!response){yield put({type: 'nom'});return }
    
        yield put({
          type: 'nom',
          payload: response,
        });

        if (callback) callback({ suc: true, obj: response });
      
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeUser, payload);
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'nom',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    admin(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    user(state, action) {
      return {
        ...state,
        mdata: action.payload,
      };
    },

    nom(state, action) {
      return {
        ...state,
      };
    },
  },
};
