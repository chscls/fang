import { queryTestRecord, removeTestRecord, addTestRecord,findTestRecord } from '../services/FyTestRecordMngSvc';

export default {
  namespace: 'fyTestRecord',

  state: {
    testRecord: null,
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTestRecord, payload);
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
      const response = yield call(addTestRecord, payload);
      yield put({
        type: 'ok',
        payload: response,
      });
      if (callback) callback(response.id);
    },*clear({ payload, callback }, { call, put }) {
      yield put({
        type: 'ok',
        payload: null,
      });
    }, *find({ payload, callback }, { call, put }) {
      const response = yield call(findTestRecord, payload);
      yield put({
        type: 'ok',
        payload: response,
      });
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeTestRecord, payload);
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
    ok(state, action) {
      return {
        ...state,
        testRecord: action.payload,
      };
    },
    nom(state, action) {
      return {
        ...state,
      };
    },
  
  },
};
