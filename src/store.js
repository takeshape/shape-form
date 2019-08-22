import {createStore as createReduxStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware, {END} from 'redux-saga';
import rootSaga from './saga';
import {defaultReducer} from './reducer';

const sagaMiddleware = createSagaMiddleware();

export function createStore(initialState) {
  const enhancer = compose(
    applyMiddleware(sagaMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  );
  const store = createReduxStore(defaultReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('./reducer', () => this._store.replaceReducer(require('./reducer').defaultReducer));
  }

  sagaMiddleware.run(rootSaga);

  store.close = () => store.dispatch(END);

  return store;
}
