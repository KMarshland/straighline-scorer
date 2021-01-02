
export default function TargetLineReducer(state, action) {
    if (state === undefined) {
        // state = {
        //     start: {
        //         latitude: 35.695562,
        //         longitude: -105.934755
        //     },
        //     end: {
        //         latitude: 36.407109,
        //         longitude: -105.574308
        //     }
        // };
        state = {
            start: {
                latitude: 35.811251,
                longitude: -106.202149
            },
            end: {
                latitude: 35.810726,
                longitude: -106.203782
            }
        };
    }

    if (action.type === 'SET_START_LATITUDE') {
        state = Object.assign({}, state, {
            start: Object.assign({}, state.start, {
                latitude: action.value
            })
        });
    }

    if (action.type === 'SET_START_LONGITUDE') {
        state = Object.assign({}, state, {
            start: Object.assign({}, state.start, {
                longitude: action.value
            })
        });
    }

    if (action.type === 'SET_END_LATITUDE') {
        state = Object.assign({}, state, {
            end: Object.assign({}, state.end, {
                latitude: action.value
            })
        });
    }

    if (action.type === 'SET_END_LONGITUDE') {
        state = Object.assign({}, state, {
            end: Object.assign({}, state.end, {
                longitude: action.value
            })
        });
    }

    return state;
}
