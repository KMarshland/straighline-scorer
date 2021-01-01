import './settings.scss';
import { Component } from 'preact';

export default class Settings extends Component {

    render() {
        return (
            <div class="settings">
                <label>
                    Upload a GPS Track
                    <input type="file" />
                </label>

                <hr />
            </div>
        );
    }

}
