
export default function SmoothedGPSTrackReducer(state, action) {
    if (state === undefined) {
        state = [];
    }

    if (action.type === 'SET_SMOOTHED_GPS_TRACK') {
        state = action.smoothedTrack;
    }

    return state;
}
