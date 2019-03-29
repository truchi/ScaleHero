import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './styles/index.css'
import registerServiceWorker from './registerServiceWorker'

import './utils/polyfills'
import App from './components/App'
import store from './store'

setTimeout(() => {
    ReactDOM.render((
        <Provider store={ store }>
            <App />
        </Provider>
    ),
    document.getElementById('root'))
    registerServiceWorker()
}, 50)
