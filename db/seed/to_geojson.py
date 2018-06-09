# Loops through buildings data and converts to geojson

import os
import ast
import numpy as np

from pg import *

geojson = {
  "type": "FeatureCollection",
  "features": []
}

def init():
  cur.execute("SELECT * FROM buildings")
  buildings = cur.fetchall()
  for building in buildings:
    if building[19] == None or len(building[19]) == 0:
      continue

    properties = {}
    for idx in range(len(GEOJSON_FEATURES)):
      properties[GEOJSON_FEATURES[idx]] = building[idx]
    try:
      coordinates = json.loads(building[19])
      if len(coordinates) < 1: # Case empty array
        continue
      building_data = {
          "type": "Feature",
          "properties": properties,
          "geometry": {
              "type": "Polygon",
              "coordinates": [coordinates]
          }
      }
      geojson["features"].append(building_data)
    except:
      continue
  with open("buildings.geojson", "w") as outfile:
    json.dump(geojson, outfile)
    outfile.close()

init()
