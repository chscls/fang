import {
  queryQuestion,
  removeQuestion,
  addQuestion,
  findQuestion,
  updateOptions,
  recycleQuestion,
  queryQuestionRe,
  recoveryQuestion,
  updateQuestionQuestions
} from '../services/FyQuestionMngSvc';

export default {
  namespace: 'fyQuestion',

  state: {
    question: null,
    dataRe: {
      list: [],
      pagination: {},
    },
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {

    *updateQuestionQuestions({ payload ,callback}, { call, put }) {
      const response = yield call(updateQuestionQuestions, payload);
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'ok',
        payload: response,
      });
      if (callback) callback(response);


    },
    *fetchRe({ payload }, { call, put }) {
    const response = yield call(queryQuestionRe, payload);
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
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryQuestion, payload);
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
    *find({ payload, callback }, { call, put }) {
      const response = yield call(findQuestion, payload);
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'ok',
        payload: response,
      });
      if (callback) callback(response);
    },
    *updateOptions({ payload, callback }, { call, put }) {
      const response = yield call(updateOptions, payload);
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'ok',
        payload: response,
      });
      if (callback) callback(response.id);
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addQuestion, payload);
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
    },*recycle({ payload, callback }, { call, put }) {
      const response = yield call(recycleQuestion, payload);
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'nom',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeQuestion, payload);
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'nom',
        payload: response,
      });
      if (callback) callback();
    },
    *recovery({ payload, callback }, { call, put }) {
      const response = yield call(recoveryQuestion, payload);
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
