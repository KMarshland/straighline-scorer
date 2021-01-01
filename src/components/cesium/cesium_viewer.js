import { Component } from 'preact';

export default class CesiumViewer extends Component {

    constructor(props) {
        super(props);

        this._id = `cesium-viewer-${Math.random().toString(36).slice(2)}`
    }

    componentDidMount() {
        this.viewer = new window.Cesium.Viewer(this._id, {
            terrainProvider: window.Cesium.createWorldTerrain()
        });
    }

    render() {
        return (
            <div id={this._id} />
        );
    }

}
