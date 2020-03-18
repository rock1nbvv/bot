import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducers';

import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

export function configureStore() {
  let store = createStore(reducers, {}, applyMiddleware(thunk));
  if (process.env.NODE_ENV === 'development') {
    const logger = createLogger();
    store = createStore(reducers, {}, composeWithDevTools(applyMiddleware(logger, thunk)));
  }
  return store;
}
