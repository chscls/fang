import {
  queryTestRecord,
  removeTestRecord,
  addTestRecord,
  findTestRecord,
  queryTestRecordDetail,
  queryMyTestRecord,
  queryTestRecordStatistics
} from '../services/FyTestRecordMngSvc';
import {
  confirmSign
} from '../services/FyFriendMngSvc';


export default {
  namespace: 'fyTestRecord',

  state: {
    testRecord: null,
    testRecordStatistics:{},
    detailData: {
      list: [],
      pagination: {},
    },
    data: {
      list: [],
      pagination: {},
    },
    myData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *confirmSign({ payload,callback }, { call, put }) {
      const response = yield call(confirmSign, payload);
      
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'sign',
        payload:payload,
      });
      if(callback){
        callback
      }
    },
    *detail({ payload ,callback}, { call, put }) {
    
      const response = yield call(queryTestRecordDetail, payload);
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
      if(callback){
        callback(response.totalCount)
      }
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTestRecord, payload);
      if( !response){yield put({type: 'nom'});return }
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
    *fetchMy({ payload }, { call, put }) {
      const response = yield call(queryMyTestRecord, payload);
      if( !response){yield put({type: 'nom'});return }
      yield put({
        type: 'suc3',
        payload: {
          list: response.list,
          pagination: {
            pageSize: response.pageSize,
            current: response.pageNo,
            total: response.totalCount,
          },
        },
      });
    },*queryTestRecordStatistics({ payload, callback }, { call, put }) {
      const response = yield call(queryTestRecordStatistics, payload);
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'ok2',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addTestRecord, payload);
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
      const response = yield call(findTestRecord, payload);
      if(!response){yield put({type: 'nom'});return }
      yield put({
        type: 'ok',
        payload: response,
      });
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeTestRecord, payload);
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
        detailData:{
          list:action.payload.pagination.current==1?action.payload.list: state.detailData.list.concat(action.payload.list),
          pagination:action.payload.pagination

        } ,
      };
    },
    suc3(state, action) {
      return {
        ...state,
        myData: action.payload,
      };
    },
    ok(state, action) {
      return {
        ...state,
        testRecord: action.payload,
      };
    }, ok2(state, action) {
      return {
        ...state,
        testRecordStatistics: action.payload,
      };
    },
    nom(state, action) {
      return {
        ...state,
      };
    },
    sign(state, action) {
     const list =  state.detailData.list
     list[action.payload.index].sign=action.payload.realname
      return {
        ...state,
        detailData:{
          list:list,
          pagination:state.detailData.pagination

        } ,
      };
    },
  },
};
