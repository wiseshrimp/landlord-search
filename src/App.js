import React, { Component } from 'react'
import './App.css'
import { connect } from 'react-redux'

import Map from './components/Map'
import SideBar from './components/SideBar'
import SearchBar from './components/SearchBar'


class App extends Component {
  render() {
    return (
      <div className="App">
        {this.props.currentBuilding ? <SideBar {...{currentBuilding: this.props.currentBuilding}}/> : null}  
        <Map />  
        <SearchBar />
      </div>
    )
  }
}

const AppWithState = connect(
  state => ({
    currentBuilding: state.currentBuilding
  })
)(App)

export default AppWithState
