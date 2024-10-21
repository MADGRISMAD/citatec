/* eslint-disable no-console */

import { register } from 'register-service-worker'
import { outputLog } from 'shared-types'
if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      outputLog(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      outputLog('Service worker has been registered.')
    },
    cached () {
      outputLog('Content has been cached for offline use.')
    },
    updatefound () {
      outputLog('New content is downloading.')
    },
    updated () {
      outputLog('New content is available; please refresh.')
    },
    offline () {
      outputLog('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
