import { queryFriend, removeFriend, addFriend,changeGroup} from '../services/FyFriendMngSvc';

export default {
  namespace: 'fyFriend',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *changeGroup({ payload }, { call, put }) {
      const response = yield call(changeGroup, payload);
      if(!response){yield put({type: 'nom'});return }
    
        yield put({
          type: 'nom',
          payload: response,
        });

        if (callback) callback();
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFriend, payload);
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
      const response = yield call(addFriend, payload);
      if(!response){yield put({type: 'nom'});return }
    
        yield put({
          type: 'nom',
          payload: response,
        });

        if (callback) callback({ suc: true, obj: response });
     
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeFriend, payload);
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
