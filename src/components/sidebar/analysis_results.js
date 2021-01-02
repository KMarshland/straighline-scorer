import { Component } from 'preact';
import PropTypes from 'prop-types';
import AnalysisInterface from '../../state/analysis_interface.js';

export default class AnalysisResults extends Component {

    render() {
        const { analysis } = this.props;
        const { maxDeviation, trackVsLineDistance } = analysis;

        return (
            <div class="analysis-results">
                <h2>
                    Results
                </h2>

                <div>
                    Max deviation: {maxDeviation.toFixed(1)}m
                </div>

                <div>
                    Line vs track distance: {trackVsLineDistance.percent.toFixed(1)}% ({trackVsLineDistance.lineDistance.toFixed()}m / {trackVsLineDistance.trackDistance.toFixed()}m)
                </div>

                <div class="analysis-button-container">
                    <button onClick={AnalysisInterface.analyze}>
                        Run analysis!
                    </button>
                </div>
            </div>
        );
    }

}

AnalysisResults.propTypes = {
    analysis: PropTypes.object.isRequired
}
