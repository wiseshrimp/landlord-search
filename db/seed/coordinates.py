import psycopg2
import requests

from pg import *

dataWithout = cur.execute("select * from buildings")
rows = cur.fetchall()
url = 'https://data.cityofnewyork.us/resource/uve3-pyf6.json'

for building in rows:
  # if building[19] == None:
    dataset = requests.get(url, params={
      "$limit": 1,
      "$where": "bin='{}'".format(building[0])
    }).json()

    try:
      height_roof = dataset[0]["heightroof"]
      cur.execute("""
        update buildings set height_roof='{}' where building_id='{}'
      """.format(height_roof, building[0]))

      # coords = str(dataset[0]["the_geom"]["coordinates"][0][0])
      # cur.execute("""
      #   update buildings set coordinates='{}' where building_id='{}'
      # """.format(coords, building[0]))
      # TO DO: Also save the height of building
      conn.commit()
    except:
      continue


