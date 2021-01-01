import './settings.scss';
import { Component } from 'preact';
import store from '../../state/store.js';
import PropTypes from 'prop-types';
import AnalysisProgress from './analysis_progress.js';
import AnalysisInterface from '../../state/analysis_interface.js';
import AnalysisResults from './analysis_results.js';

export default class Settings extends Component {

    render() {
        return (
            <div class="settings">

                <div>
                    Target line

                    <div class="coordinates-container">
                        Start <input
                            value={this.props.targetLine.start.latitude}
                            onChange={(e) => store.dispatch({ type: 'SET_START_LATITUDE', value: e.target.value })}
                        />, <input
                            value={this.props.targetLine.start.longitude}
                            onChange={(e) => store.dispatch({ type: 'SET_START_LONGITUDE', value: e.target.value })}
                        />
                    </div>

                    <div class="coordinates-container">
                        End <input
                            value={this.props.targetLine.end.latitude}
                            onChange={(e) => store.dispatch({ type: 'SET_END_LATITUDE', value: e.target.value })}
                        />, <input
                            value={this.props.targetLine.end.longitude}
                            onChange={(e) => store.dispatch({ type: 'SET_END_LONGITUDE', value: e.target.value })}
                        />
                    </div>

                </div>

                <hr />

                <label>
                    Upload a GPS Track
                    <input type="file" />
                </label>

                Will be displayed in purple

                <hr />

                <button onClick={AnalysisInterface.analyze}>
                    Start analysis
                </button>

                <AnalysisProgress
                    analysisProgress={this.props.analysisProgress}
                />

                <hr />

                <AnalysisResults analysis={this.props.analysis} />
            </div>
        );
    }

}

Settings.propTypes = {
    analysisProgress: PropTypes.object.isRequired,
    analysis: PropTypes.object.isRequired
}
