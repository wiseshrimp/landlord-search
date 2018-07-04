import React from 'react'

function normalize(string) {
  return string.trim().toUpperCase()
}

class LandlordSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      possibleBuildings: [],
      possibleNames: [],
      searchInput: ''
    }
  }

  onInput = ev => {
    let nInput = normalize(ev.target.value)
    if (nInput.length > 2) {
      this.searchLandlord(nInput)
    }
    this.setState({
      searchInput: nInput
    })
  }

  onComplete = ev => {
    if (ev.keyCode === 13) {
      // TO DO: Do a check to see if there are any buildings with that landlord name -- because it's a search input, may not match
      console.log("Final Search: ", this.state.searchInput)
    }
  }
  
  searchLandlord = name => {
    let possibleNames = []
    let possibleBuildings = this.props.buildings.map(building => {
      if (!building.landlord_name) {
        return
      }
      let nName = normalize(building.landlord_name)
      if (nName.includes(name)) {
        if (!possibleNames.includes(nName)) {
          possibleNames.push(nName)
        }
        return building
      }
    })
    this.setState({
      possibleBuildings,
      possibleNames
    })
  }

  renderOption = name => (
    <div
      key={`landlord-${name}`}
      className="landlord-option"
      onClick={this.onOptionClick}>
      { name }
    </div>
  )

  onOptionClick = ev => {
    let { possibleBuildings } = this.state
    let matchedBuildings = []
    for (let idx = 0; idx < possibleBuildings.length; idx++) {
      let building = possibleBuildings[idx]
      if (!building) {
        continue
      }
      let nName = normalize(building.landlord_name)
      let sName = normalize(ev.target.innerText)
      if (nName === sName) { 
        matchedBuildings.push(building)
      }
    }
    // TO DO: Set a property in store of matchedBuildings ==> render only these buildings
    this.setState({
      possibleBuildings: matchedBuildings
    })
    this.props.setVisibleBuildings(matchedBuildings)
  }

  render() {
    let { possibleNames } = this.state

    return (
      <div className="landlord-search-container">
        <input
          className="search-bar"
          placeholder="Landlord Name"
          onChange={this.onInput}
          onKeyUp={this.onComplete}
        />
        <div className="landlord-search-options">
          {possibleNames.length ? possibleNames.map(this.renderOption) : null}
        </div>
      </div>
    )
  }
}

// onLandlordClick = ev => { // Sets filter
//   // Filter by landlord
//   map.setFilter("buildings",
//     ["all", ["==", "landlord_name", ev.target.innerText]])
// }

export default LandlordSearch
