import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';

import injectTapEventPlugin from 'react-tap-event-plugin'
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

function render () {
  const Application = require('./views').default
  ReactDOM.render(
    <Application />,
    document.getElementById('root')
  )
}

render()

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          installingWorker.onstatechange = () => {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  console.log('New or updated content is available.');
                } else {
                  console.log('Content is now available offline!');
                }
                break;

              case 'redundant':
                console.error('Service Worker', 'Installing Service Worker became redundant.');
                break;
            }
          };
        };
      })
      .catch(error => {
        console.error('Service Worker', error);
      });
  }
} else {
  module.hot.accept('./views', render)
  require('eruda').init()
}
