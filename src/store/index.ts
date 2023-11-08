import {combineReducers, configureStore} from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import undoable from 'redux-undo';

import modalReducer from '~/store/modal/modalSlice';
import resumeReducer from '~/store/resume/resumeSlice';
import buildReducer from '~/store/build/buildSlice';
import authReducer from '~/store/auth/authSlice';
import storage from './storage';
import syncSaga from './saga/sync';


const sagaMiddleware = createSagaMiddleware();
const reducers = combineReducers({
    modal: modalReducer,
    resume: undoable(resumeReducer),
    build: buildReducer,
    auth: authReducer,
});

const persistedReducers = persistReducer({key: 'root', storage,  whitelist: []}, reducers);

const store = configureStore({
    reducer: persistedReducers,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST'],
        },
      }).concat(sagaMiddleware);
    },
});

sagaMiddleware.run(() => syncSaga(store.dispatch));

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
