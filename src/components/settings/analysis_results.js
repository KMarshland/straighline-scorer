import { Component } from 'preact';
import PropTypes from 'prop-types';

export default class AnalysisResults extends Component {

    render() {
        const { analysis } = this.props;
        const { maxDeviation } = analysis;

        return (
            <div class="analysis-results">
                Max deviation: {maxDeviation.toFixed(1)}m
            </div>
        );
    }

}

AnalysisResults.propTypes = {
    analysis: PropTypes.object.isRequired
}
