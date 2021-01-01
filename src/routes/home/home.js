import { Provider, connect } from 'react-redux';
import './home.scss';
import CesiumViewer from '../../components/cesium/cesium_viewer.js';
import Settings from '../../components/settings/settings.js';
import store from '../../state/store.js';

const Home = ({ beans }) => (
	<div class="home">
		<CesiumViewer />

		<Settings />
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
