import { Component, Fragment } from 'preact';
import PropTypes from 'prop-types';
import AnalysisInterface from '../../state/analysis_interface.js';

export default class AnalysisResults extends Component {

    render() {
        const { analysis } = this.props;
        const { maxDeviation, areaWeightedDeviation, trackVsLineDistance } = analysis || {};

        return (
            <div class="analysis-results">
                <h2>
                    Results
                </h2>

                {
                    analysis &&
                    <Fragment>
                        <div>
                            Max deviation: {maxDeviation.toFixed(2)}m
                        </div>
                        <div>
                            Area-weighted deviation: {areaWeightedDeviation.weightedDeviation.toFixed(2)}m ({areaWeightedDeviation.area.toFixed()}m<sup>2</sup>)
                        </div>

                        <div>
                            Line vs track distance: {trackVsLineDistance.percent.toFixed(1)}% ({trackVsLineDistance.lineDistance.toFixed()}m / {trackVsLineDistance.trackDistance.toFixed()}m)
                        </div>
                    </Fragment>
                }

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
    analysis: PropTypes.object
}
