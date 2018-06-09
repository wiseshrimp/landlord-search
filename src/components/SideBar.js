import React, { Component } from 'react'
import './SideBar.css'

class SideBar extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log(this.props)
  }

  render() {
    return (
      <div className="sidebar">
      </div>
    )
  }
}

export default SideBar