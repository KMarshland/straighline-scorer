export default function AnalysisReducer(state, action) {
    if (state === undefined) {
        state = {};
    }

    if (action.type === 'SET_ANALYSIS') {
        state = action.analysis;
    }

    if (action.type === 'START_ANALYSIS') {
        state = {};
    }

    return state;
}
