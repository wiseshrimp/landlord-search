import React from 'react'
import { Router, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import App from './App'
import SideBar from './components/SideBar'

const history = createBrowserHistory()

const routes = props => (
  <Router {...props}
    history={history}>
    <div>
      <Route exact path="/" component={App} />
    </div>
  </Router>
)

export default routes
