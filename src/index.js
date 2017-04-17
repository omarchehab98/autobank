import React from 'react';
import ReactDOM from 'react-dom';
import './index.sass';

let Application;
let root;
function render() {
	Application = require('./views').default;
	root = ReactDOM.render(
		Application,
		document.getElementById('root'),
		root
	);
}

render();

if (process.env.NODE_ENV === 'production') {
	if ('serviceWorker' in navigator && location.protocol === 'https:') {
		navigator.serviceWorker.register('/service-worker.js');
	}
} else {
	if (module.hot) {
		module.hot.accept('./views', render);
	}
}
