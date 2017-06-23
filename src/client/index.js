import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
// eslint-disable-next-line import/no-unresolved
import './environment.js'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Snackbar from 'material-ui/Snackbar'

import injectTapEventPlugin from 'react-tap-event-plugin'
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

function render (reload) {
  const Application = require('./views').default
  ReactDOM.render(
    <Application />,
    document.getElementById('root')
  )
}

render()
showSnackbar(false)

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        reg.onupdatefound = () => {
          const installingWorker = reg.installing
          installingWorker.onstatechange = () => {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  showSnackbar(
                    5000,
                    'New content available!',
                    'reload',
                    () => window.location.reload()
                  )
                } else {
                  showSnackbar(
                    3000,
                    'Application is now available offline!'
                  )
                }
                break

              case 'redundant':
                console.error('Service Worker', 'Installing Service Worker became redundant.')
                break
            }
          }
        }
      })
      .catch(error => {
        console.error('Service Worker', error)
      })
  }
} else {
  module.hot.accept('./views', render)
  require('eruda').init()
}

function showSnackbar (duration, message, action, onAction) {
  function snackbar (isOpen, message = '', action, onAction) {
    ReactDOM.render(
      <MuiThemeProvider>
        <Snackbar
          open={isOpen}
          message={message}
          action={action}
          onActionTouchTap={onAction}
          onRequestClose={() => {
            snackbar(false)
            clearTimeout(automaticClose)
          }} />
      </MuiThemeProvider>,
      document.getElementById('snackbar')
    )
  }
  if (duration) {
    snackbar(true, message, action, onAction)
  }
  const automaticClose = setTimeout(() => snackbar(false), duration)
}
