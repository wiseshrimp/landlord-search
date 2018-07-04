export const actions = {
  SET_CURRENT_BUILDING: 'SET_CURRENT_BUILDING',
  SET_VISIBLE_BUILDINGS: 'SET_VISIBLE_BUILDINGS'
}

export const setCurrentBuilding = currentBuilding => ({
  type: actions.SET_CURRENT_BUILDING,
  currentBuilding
})

export const setVisibleBuildings = visibleBuildingsArr => ({
  type: actions.SET_VISIBLE_BUILDINGS,
  visibleBuildings: visibleBuildingsArr
})
