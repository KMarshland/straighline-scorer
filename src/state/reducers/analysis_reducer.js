const RESET_ANALYSIS_ON = new Set([
    'START_ANALYSIS',
    'SET_START_LATITUDE',
    'SET_START_LONGITUDE',
    'SET_END_LATITUDE',
    'SET_END_LONGITUDE',
    'SET_GPS_TRACK'
]);

export default function AnalysisReducer(state, action) {
    if (state === undefined) {
        state = null;
    }

    if (action.type === 'SET_ANALYSIS') {
        state = action.analysis;
    }

    if (RESET_ANALYSIS_ON.has(action.type)) {
        state = null;
    }

    return state;
}
