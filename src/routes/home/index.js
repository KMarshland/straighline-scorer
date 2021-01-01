import style from './style.css';
import CesiumViewer from '../../components/cesium/cesium_viewer.js';

const Home = () => (
	<div class={style.home}>
		<CesiumViewer />
	</div>
);

export default Home;
