import { Component } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import store from '../../state/store.js';
import PropTypes from 'prop-types';
import FileInterface from '../../state/file_interface.js';

export default class Configuration extends Component {

    constructor(props) {
        super(props);

        this.onGPSTrackChange = this.onGPSTrackChange.bind(this);
    }

    onGPSTrackChange(event) {
        const files = event.target.files;
        if (!files.length) {
            return;
        }

        const file = files[0];
        FileInterface.readFile(file);
    }

    render() {
        return (
            <div class="configuration">
                <h2>Configuration</h2>

                <div class="goal-container">
                    <div class="coordinates-container">
                        <span>Start</span> <input
                        value={this.props.targetLine.start.latitude}
                        onChange={(e) => store.dispatch({ type: 'SET_START_LATITUDE', value: e.target.value })}
                    />, <input
                        value={this.props.targetLine.start.longitude}
                        onChange={(e) => store.dispatch({ type: 'SET_START_LONGITUDE', value: e.target.value })}
                    />
                    </div>

                    <div class="coordinates-container">
                        <span>End</span> <input
                        value={this.props.targetLine.end.latitude}
                        onChange={(e) => store.dispatch({ type: 'SET_END_LATITUDE', value: e.target.value })}
                    />, <input
                        value={this.props.targetLine.end.longitude}
                        onChange={(e) => store.dispatch({ type: 'SET_END_LONGITUDE', value: e.target.value })}
                    />
                    </div>
                </div>

                <div class="upload-container">
                    <label class="btn">
                        <FontAwesomeIcon icon={faUpload} /> Upload a GPS Track
                        <input
                            type="file"
                            accept=".kml,.kmz,.gpx"
                            onChange={this.onGPSTrackChange}
                        />
                    </label>
                </div>

                <div>
                    Target Yellow / GPS Track Magenta / Smoothed Purple
                </div>
            </div>
        );
    }

}

Configuration.propTypes = {
    targetLine: PropTypes.object.isRequired
}
