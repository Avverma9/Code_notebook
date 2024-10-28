import { combineReducers } from 'redux';
import contentReducer from './reducers/Content';

// Combine reducers into a rootReducer
const rootReducer = combineReducers({
    content: contentReducer,
});

export default rootReducer;
