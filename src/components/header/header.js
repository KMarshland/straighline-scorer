import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './header.scss';

const Header = () => (
	<header class={style.header}>
		<h1>Straightline Mission Analyzer</h1>
		<nav>
			<Link activeClassName={style.active} href="/">Home</Link>
			<Link activeClassName={style.active} href="/about">About</Link>
		</nav>
	</header>
);

export default Header;
