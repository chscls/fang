import { queryTest, removeTest, addTest,findTest ,updateTestQuestions} from '../services/FyTestMngSvc';

export default {
  namespace: 'fyTest',

  state: {
    test: null,
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *updateTestQuestions({ payload,callback }, { call, put }) {
      const response = yield call(updateTestQuestions, payload);
      yield put({
        type: 'nom',
      })
      if (callback) callback(response);


    },
    
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTest, payload);
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
      const response = yield call(addTest, payload);
      yield put({
        type: 'suc',
        payload: response,
      });
      if (callback) callback(response.id);
    },*clear({ payload, callback }, { call, put }) {
      yield put({
        type: 'ok',
        payload: null,
      });
    }, *find({ payload, callback }, { call, put }) {
      const response = yield call(findTest, payload);
      yield put({
        type: 'ok',
        payload: response,
      });
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeTest, payload);
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
