import { Provider, connect } from 'react-redux';
import './home.scss';
import PathViewer from '../../components/path_viewer/path_viewer.js';
import Settings from '../../components/settings/settings.js';
import store from '../../state/store.js';

const Home = (props) => (
	<div class="home">
		<PathViewer
			gpsTrack={props.gpsTrack}
			targetLine={props.targetLine}
		/>

		<Settings {...props} />
	</div>
);

const ConnectedHome = connect(state => state)((props) => (
	<Home {...props} />
));

const HomeWithStore = () => (
	<Provider store={store}>
		<ConnectedHome />
	</Provider>
);

export default HomeWithStore;
