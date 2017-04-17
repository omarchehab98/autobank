import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';

import HomePage from 'pages/home.js';

export default (
	<Layout>
		<Router>
			<HomePage path="/" />
		</Router>
	</Layout>
);

function Layout(props) {
	return (
		props.children
	);
}
