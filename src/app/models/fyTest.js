import {
  queryTest,
  removeTest,
  addTest,
  findTest,
  updateTestQuestions,
  recycleTest,
  recoveryTest,
  queryTestRe,
  downShopTest,
  upShopTest
} from '../services/FyTestMngSvc';


export default {
  namespace: 'fyTest',

  state: {
    test: null,
    data: {
      list: [],
      pagination: {},
    },
    dataRe: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    
   

    *updateTestQuestions({ payload, callback }, { call, put }) {
      const response = yield call(updateTestQuestions, payload);
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'ok',
        payload: response,
      });
      if (callback) callback(response);
    },

    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTest, payload);
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
    *fetchRe({ payload }, { call, put }) {
      const response = yield call(queryTestRe, payload);
      
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'suc2',
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
      const response = yield call(addTest, payload);
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'ok',
        payload: response,
      });
      if (callback) callback(response.id);
    },
    *clear({ payload, callback }, { call, put }) {
      yield put({
        type: 'ok',
        payload: null,
      });
    },
    *find({ payload, callback }, { call, put }) {
      
      const response = yield call(findTest, payload);
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'ok',
        payload: response,
      });
      if (callback) callback(response);
    },*recycle({ payload, callback }, { call, put }) {
      const response = yield call(recycleTest, payload);
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'nom',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeTest, payload);
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'nom',
        payload: response,
      });
      if (callback) callback();
    },*upShop({ payload, callback }, { call, put }) {
      const response = yield call(upShopTest, payload);
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'nom',
        payload: response,
      });
      if (callback) callback();
    },*downShop({ payload, callback }, { call, put }) {
      const response = yield call(downShopTest, payload);
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'nom',
        payload: response,
      });
      if (callback) callback();
    },
    *recovery({ payload, callback }, { call, put }) {
      const response = yield call(recoveryTest, payload);
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
    suc2(state, action) {
      return {
        ...state,
        dataRe: action.payload,
      };
    },
    ok(state, action) {
      return {
        ...state,
        test: action.payload,
      };
    },
    nom(state, action) {
      return {
        ...state,
      };
    },
  },
};
