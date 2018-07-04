import { actions } from '../actions/building-actions'

const INITIAL_BUILDING_STATE = {
  currentBuilding: null,
  visibleBuildings: []
}

export default (state = INITIAL_BUILDING_STATE, action) => {
  switch (action.type) {
    case actions.SET_CURRENT_BUILDING:
      return {
        ...state, ...{
          currentBuilding: action.currentBuilding
        }
      }
    case actions.SET_VISIBLE_BUILDINGS:
      return {
        ...state, ...{
          visibleBuildings: action.visibleBuildings
        }
      }  
    default:
      return state  
  }
}
