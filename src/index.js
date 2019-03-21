import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import registerServiceWorker from './registerServiceWorker'
import './utils/polyfills'
import App from './components/App'

setTimeout(() => {
    ReactDOM.render(
        <App />,
        document.getElementById('root'))
    registerServiceWorker()
}, 500)
