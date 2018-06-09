# -*- coding: utf-8 -*-

# TO DO:
  # simultaneously check for likelihood of rent controlled apartment
# switch enigma to api get_export to bypass 10,000 limit: https://docs.enigma.com/public/public_v20_api_get_export_id.html
# Delete unnecessary rows:
  # city_council_district, lat, long, height_roof

import requests
import time
from threading import Timer
import os
import csv

from Building import Building
from driver import *
from constants import *
from pg import *

# Stopped around 6200 but overwrote landlord info with no landlords
START_IDX = 9018

class Populator:
  def __init__(self, snapshot_id, is_db_set, is_replacing_duplicates, idx = START_IDX):
    self.snapshot_id = snapshot_id
    self.row_offset = 6400 # hasn't run yet -- run
    self.current_idx = self.row_offset
    self.row_limit = 4000
    self.timer = None
    self.start_idx = idx
    self.is_replacing_duplicates = is_replacing_duplicates
    if is_db_set == False:
      self.build_db()
    self.populate()
  
  def build_db(self):
    cur.execute(CREATE_BUILDINGS_QUERY)
    conn.commit()
  
  def get_enigma_data(self):
    url = ENIGMA_PARAMS.format(
      BASE_URL,
      self.snapshot_id,
      self.row_offset,
      self.row_limit
    )
    r = requests.get(
      url,
      headers=HEADERS
    )
    dataset = r.json()
    # number of rows, max = 10000 for engima query
    row_count = dataset['current_snapshot']['row_count']
    self.data = dataset['current_snapshot']['table_rows']['rows']

  def get_full_enigma_data(self):
    file = open("db/seed/data.csv", "rU")
    reader = csv.reader(file, delimiter=',')
    idx = 0
    for building_data in reader:
      if idx < self.start_idx:
        idx += 1
        continue
      building_class = building_data[44]
      if building_data[24] == None:
        idx += 1
        continue
      addressArr = building_data[24].split(' ', 1)
      class_prefix = building_class[0]

      if building_class == None: # Don't save to db if not a proper building class
        idx += 1
        continue
      if class_prefix not in {"A", "B", "C", "D", "S"} and building_class not in {"HB", "HH", "HR", "R1", "R2", "R3", "R4", "R6", "R7", "R8", "R9", "RR"}:
        idx += 1
        continue
      if len(addressArr) == 1: # Don't save to db if not a full address
        idx += 1
        continue

      building = Building(building_data)
      building.get_bis()

      if driver.title != DEFAULT_TITLE:
        print("Overworked server. Starting again at index {}".format(idx))
        time.sleep(.5)

        populator = Populator(ENIGMA_BUILDINGS_ID, True, False, idx)
        return

      building.get_bis_data()
      if driver.title != PROPERTY_PROFILE_TITLE:  # listing not found -- move to next index
        print("Listing does not exist in BIS network")
        idx += 1
        continue  # exit out of loop and proceed to next entry
      building.get_building_id()

      is_duplicate = building.check_if_duplicate()
      if self.is_replacing_duplicates and is_duplicate:
        building.delete_duplicate()

      if is_duplicate and not self.is_replacing_duplicates:
        print("Duplicate entry: #{}".format(building.building_id))
        idx += 1
        continue


      print("Current idx: {}".format(idx))

      building.get_complaints_and_violations()
      building.get_landlord()
      building.get_lat_long_coordinates()
      building.get_building_footprint()
      building.post_data(idx)
      idx += 1

  def retry_bis(self, building):
    building.get_bis()
    self.timer = None

  def populate(self):
    # self.get_enigma_data()
    self.get_full_enigma_data()

    # for building_data in self.data:
    #   self.current_idx += 1
    #   building_class = building_data[44]
    #   if building_data[24] == None:
    #     continue
    #   addressArr = building_data[24].split(' ', 1)
    #   class_prefix = building_class[0]

    #   if building_class == None: # Don't save to db if not a proper building class
    #     continue
    #   if class_prefix not in {"A", "B", "C", "D", "S"} and building_class not in {"HB", "HH", "HR", "R1", "R2", "R3", "R4", "R6", "R7", "R8", "R9", "RR"}:
    #     continue
    #   if len(addressArr) == 1: # Don't save to db if not a full address
    #     continue

    #   building = Building(building_data)
    #   building.get_bis()

      # if driver.title != DEFAULT_TITLE:
      #   print("Overworked server. Starting again.")
      #   time.sleep(.5)
      #   building.get_bis()
      #   break

      # building.get_bis_data()
      # if driver.title != PROPERTY_PROFILE_TITLE:  # listing not found -- move to next index
      #   print("Listing does not exist in BIS network")
      #   continue  # exit out of loop and proceed to next entry
      # building.get_building_id()
      
      # is_duplicate = building.check_if_duplicate()
      # if self.is_replacing_duplicates and is_duplicate:
      #   building.delete_duplicate()
      
      # if is_duplicate and not self.is_replacing_duplicates:
      #   print("Duplicate entry: #{}".format(building.building_id))
      #   continue

      # print("Current idx: {}".format(self.current_idx))

      # building.get_complaints_and_violations()
      # building.get_landlord()
      # # building.get_lat_long_coordinates()
      # building.get_building_footprint()
      # building.post_data(self.current_idx)    

  # TO DO: Divide number of entries by 10,000 (query limit) loop through

 # (enigma id to query, db already created, replace duplicates)
populator = Populator(ENIGMA_BUILDINGS_ID, True, False, START_IDX)

START_IDX_2 = 20000
