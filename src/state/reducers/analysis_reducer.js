export default function AnalysisReducer(state, action) {
    if (state === undefined) {
        state = null;
    }

    if (action.type === 'SET_ANALYSIS') {
        state = action.analysis;
    }

    if (action.type === 'START_ANALYSIS') {
        state = null;
    }

    return state;
}
