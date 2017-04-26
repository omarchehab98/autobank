import ReactDOM from 'react-dom'
import './index.scss'

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

function render () {
  const Application = require('./views').default
  ReactDOM.render(
    Application,
    document.getElementById('root')
  )
}

render()

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    navigator.serviceWorker.register('/service-worker.js')
  }
} else if (module.hot) {
  module.hot.accept('./views', render)
  require('eruda').init()
}
