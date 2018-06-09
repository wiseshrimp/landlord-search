import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import store from './redux/store'
import routes from './routes'

const root = (
  <Provider store={store}>
    {routes()}  
  </Provider>  
)

ReactDOM.render(
  root,
  document.getElementById('root')
)

registerServiceWorker()
