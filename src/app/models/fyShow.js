import { query, remove, add,find, addCatalog } from '../services/FyShowMngSvc';

export default {
  namespace: 'fyShow',

  state: {
    show:{},
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *clear({ payload, callback }, { call, put }) {
      yield put({
        type: 'ok',
        payload: null,
      });
    },*addCatalog({ payload, callback }, { call, put }) {
   
      const response = yield call(addCatalog, payload);
      if(!response){yield put({type: 'nom'});return }
     
        yield put({
          type: 'ok',
          payload: response,
        });
        if(callback)callback(response)
    },

   
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
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
    },*find({ payload, callback }, { call, put }) {
   
      const response = yield call( find, payload);
      if(!response){yield put({type: 'nom'});return }
     
        yield put({
          type: 'ok',
          payload: response,
        });
        if(callback)callback(response)
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      if(!response){yield put({type: 'nom'});return }
     
        yield put({
          type: 'ok',
          payload: response,
        });

   
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
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
    ok(state, action) {
      return {
        ...state,
        show: action.payload
      };
    },
    nom(state, action) {
      return {
        ...state,
      };
    },
  },
};
