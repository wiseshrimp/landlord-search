import React from 'react'
import mapboxgl from 'mapbox-gl'
import axios from 'axios'
import 'mapbox-gl/dist/mapbox-gl.css'
import { connect } from 'react-redux'
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'

import './SearchBar.css'

import { setCurrentBuilding } from '../redux/actions/building-actions'

// import mapJson from '../mapbox/data'
let map
let finalJson = []


const Mapbox = ReactMapboxGl({
  accessToken: ACCESS_TOKEN
})

function normalize(string) {
  return string.trim().toUpperCase()
}

class Map extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fillBuildings: [],
      dotBuildings: [],
      buildings: [],
      landlordNameOptions: [],
      searchedBuildings: [],
      searchedLandlordName: null
    }
  }

  componentWillMount() {
    // axios.get('/api/buildings')
    //   .then(res => {
    //     this.setState({
    //       buildings: res.data.data
    //     })
    //   })

    axios.get('/api/buildings/dots')
      .then(res => {
        this.setState({
          dotBuildings: res.data.data
        })
      })
    
    axios.get('/api/buildings/fill')
      .then(res => {
        this.setState({
          fillBuildings: res.data.data
        })
      })

    // mapboxgl.accessToken = 'pk.eyJ1Ijoid2lzZXNocmltcCIsImEiOiJjamhtZHFkbHEzOWI1MzZvMWh2dWc0dnpwIn0.mPpRpAYssv7wcIKaAijezw'

    // if (!mapboxgl.supported()) {
    //   alert('Your browser does not support Mapbox GL')
    // } else {
    // this.map = map = new mapboxgl.Map({
    //   container: 'map',
    //   style: 'mapbox://styles/wiseshrimp/cjhtxw1jr0a442rmtcq7kulra',
    //   center: [-73.94, 40.68],
    //   zoom: 10
    // })

    // map.on('click', 'buildings', ev => {
    //   let {
    //     building_number,
    //     complaints_link,
    //     dob_violations_link,
    //     ecb_violations_link,
    //     landlord_name,
    //     num_of_complaints,
    //     num_of_dob_violations,
    //     num_of_ecb_violations,
    //     num_of_res_units,
    //     street_name,
    //     year_built,
    //     zip_code
    //   } = ev.features[0].properties

    //   map.flyTo({
    //     center: ev.lngLat
    //   })

    // this.props.setCurrentBuilding({
    //   building_number,
    //   complaints_link,
    //   dob_violations_link,
    //   ecb_violations_link,
    //   landlord_name,
    //   num_of_complaints,
    //   num_of_dob_violations,
    //   num_of_ecb_violations,
    //   num_of_res_units,
    //   street_name,
    //   year_built,
    //   zip_code
    // })
    // })
    // }
  }

  searchLandlord = name => {
    let landlordNameOptions = []
    let searchedBuildings = this.state.buildings.map(building => {
      if (!building.landlord_name) {
        return
      }
      let landlordName = normalize(building.landlord_name)
      if (landlordName.includes(name)) {
        if (!landlordNameOptions.includes(landlordName)) {
          landlordNameOptions.push(landlordName)
        }
        return building
      }
    })
    this.setState({
      searchedBuildings,
      landlordNameOptions
    })
  }

  onLandlordComplete = ev => {
    if (ev.keyCode === 13) {
      console.log("Final Search: ", this.state.searchedLandlordName)
    }
  }

  onLandlordInput = ev => {
    let input = normalize(ev.target.value)
    if (input.length > 4) {
      this.searchLandlord(input)
    }
    this.setState({
      searchedLandlordName: input
    })
  }
  
  onBuildingInput = ev => {
    let addressArr = ev.target.value.split(' ')
    if (addressArr.length > 1) {
      let buildingNum = Number(addressArr[0].replace(/\D+/g, '', ''))
      let street = addressArr[1].trim().toUpperCase()

      // let buildingResults = map.setFilter('buildings', ['all', ['==', 'building_number', buildingNum]])
      // let identifiedBuildings = map.queryRenderedFeatures('buildings')
      // let foundBuildingsFilter = ['all']
      // for (var i = 0; i < identifiedBuildings.length; i++) {
      //   if (identifiedBuildings[i].layer.id != "buildings") {
      //     continue
      //   }
      //   if (identifiedBuildings[i].properties["street_name"].includes(street)) {
      //     let filter = [
      //       "==",
      //       "building_id", identifiedBuildings[i].properties.building_id]

      //     foundBuildingsFilter.push(filter)
      //   }
      // }
      // map.setFilter(f => {
      //   console.log(f)
      //   return true
      // })
    }
  }

  onLandlordClick = ev => { // Sets filter
    // Filter by landlord
    map.setFilter("buildings",
      ["all", ["==", "landlord_name", ev.target.innerText]])
  }

  landlordRec = landlordName => (
    <div
      key={landlordName}
      className="landlord-option"
      onClick={this.onLandlordClick}>
      {landlordName}
    </div>
  )

  renderLandlordSearch = () => (
    <div>
      <input className="search-bar"
        placeholder="Landlord Name"
        onChange={this.onLandlordInput}
        onKeyUp={this.onLandlordComplete}
      />
      {this.state.landlordNameOptions.length ? this.state.landlordNameOptions.map(this.landlordRec) : null}
    </div>
  )

  renderBuildingSearch = () => (
    <div>
      <input className="search-bar"
        placeholder="Address"
        onChange={this.onBuildingInput}
      />
      {/* {this.state.landlordNameOptions.length ? this.state.landlordNameOptions.map(this.landlordRec) : null} */}
    </div>
  )

  renderFillBuildingFeature = building => {
    // if (building.coordinates == "None" || building.coordinates == null || building.coordinates == undefined) {
    //   try {
    //     let latitude = Number(building.latitude),
    //       longitude = Number(building.longitude)
    //     let coords = [
    //       [
    //         longitude - 0.00005,
    //         latitude - 0.00005
    //       ], [longitude - 0.00005, latitude + 0.00005], [longitude + 0.00005, latitude + 0.00005], [longitude + 0.00005, latitude - 0.00005]]

    //     return <Feature key={building["building_id"]} coordinates={[coords]} />
    //   } catch (err) {
    //     console.log(err)
    //     return <Feature key={building["building_id"]} coordinates={[[[]]]} />
    //   }
    // }
    // console.log(building.coordinates)
    let coords = JSON.parse(building.coordinates)
    if (!coords.length) {

      try {
        let latitude = Number(building.latitude),
          longitude = Number(building.longitude)
        let coords = [[
          longitude - 0.00005,
          latitude - 0.00005
        ], [longitude - 0.00005, latitude + 0.00005], [longitude + 0.00005, latitude + 0.00005], [longitude + 0.00005, latitude - 0.00005]]
        return <Feature key={building["building_id"]} coordinates={[coords]} />
      } catch (err) {
        console.log(err)

        return <Feature key={building["building_id"]} coordinates={[[[]]]} />
      }
    }
      
    //   if (coords == null || coords == undefined) {
    //     try {
    //       let latitude = Number(building.latitude),
    //         longitude = Number(building.longitude)
    //       let coords = [[
    //         longitude - 0.00005,
    //         latitude - 0.00005
    //       ], [longitude - 0.00005, latitude + 0.00005], [longitude + 0.00005, latitude + 0.00005], [longitude + 0.00005, latitude - 0.00005]]
    //       return <Feature key={building["building_id"]} coordinates={[coords]} />
    //     } catch (err) {
    //       console.log(err)
    //       return <Feature key={building["building_id"]} coordinates={[[[]]]} />
    //     }
    //   // return <Feature key={building["building_id"]} coordinates={[[[]]]} />    }
    // // if (typeof coords != 'object') {
    //   // console.log(coords.length)
        
    // }
    return (
      // <div key={building["building_id"]}>
      <Feature key={building["building_id"]}
        coordinates={[coords]}
      />
      // </div>  
    )
  }

  renderDotBuildingsFeature = dotBuilding => {
    switch (dotBuilding.latitude) {
      case "":
      case "None":
      case null:
      case undefined:
        return <Feature key={dotBuilding["building_id"]} coordinates={[[[]]]} />
      default:
        break  
    }  
    return (
      <Feature key={dotBuilding["building_id"]}
        coordinates={[dotBuilding.longitude, dotBuilding.latitude]}  />
    )
    // To do:
    // Finish render dot building feature ==> return <Feature /> with type="symbol" or "dot"? Make sure to do long/lat check
  }
    
  render() {
    return (
      <div className="search-bar-container">
        <Mapbox
          style="mapbox://styles/wiseshrimp/cji5ok1q10m402rq7c36s1g6d"
          center={[-73.94, 40.68]}
          containerStyle={{
            height: '100vh',
            width: '100vw'
          }}
        >
          <Layer id="fill-buildings" type="fill" paint={{ "fill-color": "#ffffff", "fill-opacity": 0.8}}>  
            {this.state.fillBuildings.length ? this.state.fillBuildings.map(this.renderFillBuildingFeature) : null}  
          </Layer>

          <Layer id="dot-buildings" type="circle">
            {this.state.dotBuildings.length ? this.state.dotBuildings.map(this.renderDotBuildingsFeature) : null}  
          </Layer>  
        </Mapbox>  
        {/* {this.renderLandlordSearch()}   */}
        {this.renderBuildingSearch()}  
      </div>
    )
  }
}

const MapWithData = connect(
  null,
  dispatch => ({
    setCurrentBuilding: currentBuilding => dispatch(setCurrentBuilding(currentBuilding))
  })
)(Map)

export default MapWithData
