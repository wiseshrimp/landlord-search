import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import React from 'react'
import { connect } from 'react-redux'
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'
import './Map.css'

import LandlordSearch from './LandlordSearch'
import { setCurrentBuilding, setVisibleBuildings } from '../redux/actions/building-actions'
import {MAPBOX_ACCESS_TOKEN, NULL_FEATURE } from '../misc/constants'

const Mapbox = ReactMapboxGl({
  accessToken: MAPBOX_ACCESS_TOKEN
})


class Map extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      center: [-73.988765, 40.71295375],
      fillBuildings: [],
      dotBuildings: [],
      buildings: [],
      zoom: 11
    }
  }

  componentWillMount() {
    let options = ['dots', 'fill']
    let fillBuildings = []
    let dotBuildings = []
    options.forEach(option => {
      axios.get(`/api/buildings/${option}`)
        .then(res => {
          if (option === options[0]) {
            dotBuildings = res.data.data
          } else {
            fillBuildings = res.data.data
          }
        })
      .then(() => {
        if (dotBuildings.length && fillBuildings.length) {
            this.setState({
              dotBuildings,
              fillBuildings,
              buildings: [ // Combine to make an ~ultimate~ list 
                ...dotBuildings,
                ...fillBuildings
              ]
            })
          }
        })
    })
  }

  onZoom = ev => {
    let zoom = this.mapEl.state.map.getZoom()
    let { lng, lat } = this.mapEl.state.map.getCenter()
    if (zoom != this.state.zoom) {
      this.setState({
        center: [lng, lat],
        zoom
      })
    }
  }

  renderFillBuildingFeature = fillBuilding => {
    if (this.state.zoom <= 13) {
      return this.renderDotBuildingFeature(fillBuilding)
    }
    let coords = JSON.parse(fillBuilding.coordinates)
    // if (!coords.length) {
    //   return this.renderDotBuildingFeature(fillBuilding)
    // }

    // Something is wrong!!!!!!!! Won't render – must be a problem with the coordinates
    // What's going on during Zoom
    return (
      <Feature key={`fill-${fillBuilding["building_id"]}`}
        coordinates={[coords]}
      />
    )
  }

  renderDotBuildingFeature = dotBuilding => {
    switch (dotBuilding.latitude) {
      case "":
      case "None":
      case null:
      case undefined:
        return (
          <Feature
            key={dotBuilding["building_id"]}
            coordinates={[[[]]]}
          />
        )
      default:
        break
    }
    return (
      <Feature
        key={dotBuilding["building_id"]}
        properties={{"num_of_complaints": dotBuilding.num_of_complaints}}
        coordinates={
          [dotBuilding.longitude, dotBuilding.latitude]
        }
      />
    )
  }

  renderAllBuildings = () => {
    return (
      <div>
        {/* {this.state.zoom <= 13 ? this.renderFillBuildings(this.state.fillBuildings, true) : this.renderFillBuildings()} */}
        {this.renderDotBuildings(this.state.buildings)}
      </div>
    )
  }

  renderDotBuildings = (dotBuildings = this.state.dotBuildings) => (
    <Layer
      id="dot-buildings"
      type="circle"
      layerOptions={{
        filter: ["has", "num_of_complaints"]
      }}
      paint={{
        "circle-color": {
          property: "num_of_complaints",
          type: "interval",
          stops: [[3, "#34cc52"], [6, "#ffcc00"], [10, "#ff4d4d"]]

        },
        "circle-opacity": 0.7,
        "circle-radius": {
          property: "num_of_complaints",
          type: "interval",
          stops: [[3, 3], [6, 5], [10, 7]]
        }
      }}
    >
      {dotBuildings.length ? dotBuildings.map(this.renderDotBuildingFeature) : null}
    </Layer>  
  )

  renderFillBuildings = (fillBuildings = this.state.fillBuildings, isZoom = false) => {
    // if (isZoom) {
    //   return (
    //     <Layer
    //       id="dot-fill-buildings"
    //       type="circle">
    //       {fillBuildings.length ? fillBuildings.map(this.renderDotBuildingFeature) : null}
    //     </Layer>  
    //   )
    // } else {
    let paint = {"fill-color": "#ffffff", "fill-opacity": 0.8 }
      return (
        <Layer
          id="fill-buildings"
          type={isZoom ? "circle" : "fill"}
          paint={isZoom ? {} : paint}
          >
          {fillBuildings.length ? fillBuildings.map(this.renderFillBuildingFeature) : null}
        </Layer>
      )
    // }
}

  renderVisibleBuildings = () => {
    // let fillBuildings = []
    // let dotBuildings = []
    // this.props.visibleBuildings.forEach(building => {
    //   if (this.state.fillBuildings.includes(building)) {
    //     fillBuildings.push(building)
    //   } else {
    //     dotBuildings.push(building)
    //   }
    let long = 0, lat = 0
    let { visibleBuildings } = this.props
    let num = 0
    
    for (var idx = 0; idx < visibleBuildings.length; idx++) {
      if (!visibleBuildings[idx].latitude || !visibleBuildings[idx].longitude) {
        continue
      }
      long += Number(visibleBuildings[idx].longitude)
      lat += Number(visibleBuildings[idx].latitude)
      num++
    }

    long = long / num
    lat = lat / num
      this.mapEl.state.map.flyTo(
        {
          zoom: 15,
          center: [
            long,
            lat
          ]
        }
      )
    // })
    return (
      <div>
        {this.renderDotBuildings(this.props.visibleBuildings)}
        {/* {this.renderFillBuildings(fillBuildings)} */}
      </div>
    )
  }

  render() {
    if (this.mapEl) {
      global.map = this.mapEl
    }
    return (
      <div>
        <Mapbox
          ref={el => this.mapEl = el}
          style="mapbox://styles/wiseshrimp/cjhv5jyh409l62rmzwvwckjzl"
          center={this.state.center}
          containerStyle={{
            height: '100vh',
            width: '100vw'
          }}
          onZoomEnd={this.onZoom}
        >          
          {this.props.visibleBuildings.length ? this.renderVisibleBuildings() : this.renderAllBuildings()}  
        </Mapbox>
        <LandlordSearch
          buildings={this.state.buildings}
          setCurrentBuilding={this.props.setCurrentBuilding}
          setVisibleBuildings={this.props.setVisibleBuildings}
        />
      </div>
    )
  }
}

const MapWithData = connect(
  state => ({
    currentBuilding: state.currentBuilding,
    visibleBuildings: state.visibleBuildings
  }),
  dispatch => ({
    setCurrentBuilding: currentBuilding => dispatch(setCurrentBuilding(currentBuilding)),
    setVisibleBuildings: visibleBuildingsArr => dispatch(setVisibleBuildings(visibleBuildingsArr))
  })
)(Map)

export default MapWithData
