import { actions } from '../actions/building-actions'

const INITIAL_BUILDING_STATE = {
  currentBuilding: null
}

export default (state = INITIAL_BUILDING_STATE, action) => {
  switch (action.type) {
    case actions.SET_CURRENT_BUILDING:
      return {
        currentBuilding: action.currentBuilding
      }
    default:
      return state  
  }
}

