export default function AnalysisProgressReducer(state, action) {
    if (state === undefined) {
        state = {};
    }

    if (action.type === 'START_ANALYSIS') {
        state = {};
    }

    if (action.type === 'ADD_ANALYSIS_PROGRESS') {
        state = Object.assign({}, state, {
            [action.step]: {
                numerator: action.numerator,
                denominator: action.denominator
            }
        })
    }

    return state;
}
