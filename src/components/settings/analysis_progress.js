import { Component } from 'preact';
import PropTypes from 'prop-types';

export default class AnalysisProgress extends Component {

    render() {
        return (
            <div class="analysis-progress">
                {
                    Object.entries(this.props.analysisProgress).map(([step, { numerator, denominator }]) =>
                        <div key={step} class="analysis-progress-item">
                            {step}: {numerator.toFixed().padStart(denominator.toFixed().length, '0')}/{denominator}
                        </div>
                    )
                }
            </div>
        );
    }

}

AnalysisProgress.propTypes = {
    analysisProgress: PropTypes.object.isRequired
}
