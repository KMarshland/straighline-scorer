import { h } from 'preact';
import { Router } from 'preact-router';

import Header from './header/header.js';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home/home.js';
import About from '../routes/about/about.js';

const App = () => (
	<div id="app">
		<Header />

		<Router>
			<Home path="/" />
			<About path="/about" />
		</Router>
	</div>
)

export default App;
