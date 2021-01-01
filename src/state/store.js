import { createStore, combineReducers } from 'redux';
import GPSTrackReducer from './reducers/gps_track_reducer.js';
import TargetLineReducer from './reducers/target_line_reducer.js';
import AnalysisProgressReducer from './reducers/analysis_progress_reducer.js';
import AnalysisReducer from './reducers/analysis_reducer.js';

const store = createStore(combineReducers({
    gpsTrack: GPSTrackReducer,
    targetLine: TargetLineReducer,
    analysisProgress: AnalysisProgressReducer,
    analysis: AnalysisReducer
}));

export default store;
