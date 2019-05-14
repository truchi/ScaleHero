import React                 from 'react'
import ReactDOM              from 'react-dom'
import { Provider }          from 'react-redux'
import registerServiceWorker from './registerServiceWorker'

import            './polyfills'
import App   from './components/App'
import store from './store/'
import './styles.scss'

/* setTimeout(() => { */
  ReactDOM.render((
    <Provider store={ store }>
      <App />
    </Provider>
  ),
    document.getElementById('root'))
  registerServiceWorker()
  /* }, 100) */
