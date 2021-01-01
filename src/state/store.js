import { createStore, combineReducers } from 'redux';
import GPSTrackReducer from './reducers/gps_track_reducer.js';
import TargetLineReducer from './reducers/target_line_reducer.js';

const store = createStore(combineReducers({
    gpsTrack: GPSTrackReducer,
    targetLine: TargetLineReducer
}));

export default store;
