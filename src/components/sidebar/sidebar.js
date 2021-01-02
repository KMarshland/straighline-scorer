import './sidebar.scss';
import { Component } from 'preact';
import Configuration from './configuration.js';
import AnalysisResults from './analysis_results.js';
import PropTypes from 'prop-types';
import AnalysisProgress from './analysis_progress.js';

export default class Sidebar extends Component {
    render () {
        return (
            <div class="sidebar">
                <Configuration
                    targetLine={this.props.targetLine}
                />

                <AnalysisResults
                    analysis={this.props.analysis}
                />

                <AnalysisProgress
                    analysisProgress={this.props.analysisProgress}
                />
            </div>
        )
    }
}

Sidebar.propTypes = {
    targetLine: PropTypes.object.isRequired,
    analysisProgress: PropTypes.object.isRequired,
    analysis: PropTypes.object.isRequired
}
