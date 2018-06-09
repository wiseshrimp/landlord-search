export const actions = {
  SET_CURRENT_BUILDING: 'SET_CURRENT_BUILDING'
}

export const setCurrentBuilding = currentBuilding => ({
  type: actions.SET_CURRENT_BUILDING,
  currentBuilding
})
