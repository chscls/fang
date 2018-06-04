import {
  queryQuestion,
  removeQuestion,
  addQuestion,
  findQuestion,
  updateOptions,
} from '../services/FyQuestionMngSvc';

export default {
  namespace: 'fyQuestion',

  state: {
    question: null,
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryQuestion, payload);
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
    *find({ payload, callback }, { call, put }) {
      const response = yield call(findQuestion, payload);
      yield put({
        type: 'ok',
        payload: response,
      });
      if (callback) callback(response);
    },
    *updateOptions({ payload, callback }, { call, put }) {
      const response = yield call(updateOptions, payload);
      yield put({
        type: 'ok',
        payload: response,
      });
      if (callback) callback(response.id);
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addQuestion, payload);
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
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeQuestion, payload);
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
        question: action.payload,
      };
    },
    nom(state, action) {
      return {
        ...state,
      };
    },
  },
};
