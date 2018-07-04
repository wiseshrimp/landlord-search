import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import buildingReducer from './reducers/building'

const initialState = {
  visibleBuildings: [],
  currentBuilding: null
}

const store = createStore(
  buildingReducer,
  initialState,
  compose(
    applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

export default store
