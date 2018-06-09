# -*- coding: utf-8 -*-

import unidecode
from geopy.geocoders import Nominatim
import requests
import time

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException, NoSuchElementException, StaleElementReferenceException
import re
from driver import *
from constants import *
from pg import *

geolocator = Nominatim()


class Building:
  def __init__(self, data):
    self.delay = 3
    self.get_address(data[24])
    self.borough = data[1]
    self.block_number = data[2]
    self.lot_number = data[3]
    self.city_council_district = data[11]
    self.building_class = data[44]
    self.zip_code = data[13]
    self.year_built = data[86]
    self.num_of_res_units = data[68]
    if self.num_of_res_units == None or self.num_of_res_units == '':
      self.num_of_res_units = 0
    self.has_landlord = False
    self.height_roof = None
    self.coordinates = None
    self.latitude = ""
    self.longitude = ""

    # Landlord info:
    self.landlord_name = 'None'

  def get_address(self, address):
    address_arr = address.split(' ', 1)
    self.address = address
    if re.search('[a-zA-Z]', address_arr[0]):
      self.building_number = int(re.search(r'\d+', address_arr[0]).group())
    else:
      self.building_number = address_arr[0]
    self.street_name = address_arr[1]

  def get_bis(self):
    driver.get(BIS_LINK)

  def get_bis_data(self):
    try:
      boroughSelect = driver.find_element_by_id("boro1")
      for option in boroughSelect.find_elements_by_tag_name("option"):
        if option.text == self.borough:
            option.click()
            break
      driver.find_element_by_name("houseno").send_keys(self.building_number)
      driver.find_element_by_name("street").send_keys(self.street_name)
      driver.find_element_by_name("go2").click()
    except NoSuchElementException as exception:
      print "Element with id boro1 on bis not found... Starting again"
      time.sleep(.5)
      self.get_bis_data()


  def get_building_id(self):
    try:
      textEl = driver.find_element_by_xpath(BUILDING_ID_XPATH)
      innerText = textEl.get_attribute("innerText")
      innerTextASCII = unidecode.unidecode(innerText)
      innerTextArr = innerTextASCII.split(' ')
      self.building_id = int(innerTextArr[2])
    except NoSuchElementException as exception:
      print "Element id not found. Starting again"
      time.sleep(.5)
      self.get_building_id()

  # Checks if building_id is already in db because enigma data has duplicates
  def check_if_duplicate(self):
    cur.execute(DUPLICATE_COUNT_QUERY.format(self.building_id))
    rows = cur.fetchall()
    count = rows[0][0]
    return count > 0
  
  def delete_duplicate(self):
    cur.execute("delete from buildings where building_id={}".format(self.building_id))
    conn.commit()
    print("Deleted duplicate from bin={}".format(self.building_id))

  def get_lat_long_coordinates(self):
    full_address = ADDRESS_COORDINATES_PARAMS.format(
        self.building_number,
        self.street_name,
        self.borough,
        self.zip_code
    )
    try:
      location = geolocator.geocode(full_address)
    except:
      self.latitude = None
      self.longitude = None
      return
    if location == None:
      self.on_error(
          "Location error: Address coordinates not found – {}".format(full_address))
      # return
      self.latitude = None
      self.longitude = None
      return
    self.latitude = location.latitude
    self.longitude = location.longitude

  def get_complaints_and_violations(self):
    self.num_of_complaints = 0
    self.num_of_dob_violations = 0
    self.num_of_ecb_violations = 0
    self.complaints_link = None
    self.dob_violations_link = None
    self.ecb_violations_link = None
    aNodes = driver.find_elements_by_tag_name("a")
    for node in aNodes:
      if "Violations-DOB" in node.text:
        violationNumberNode = driver.find_element_by_xpath(
            DOB_VIOLATIONS_XPATH)
        self.num_of_dob_violations = int(violationNumberNode.text)
        self.dob_violations_link = node.get_attribute("href")
      elif "Violations-ECB" in node.text:
        violationECBNumberNode = driver.find_element_by_xpath(
            ECB_VIOLATIONS_XPATH)
        self.num_of_ecb_violations = int(violationECBNumberNode.text)
        self.ecb_violations_link = node.get_attribute("href")
      elif "Complaints" in node.text:
        complaintNumberNode = driver.find_element_by_xpath(COMPLAINT_XPATH)
        self.num_of_complaints = int(complaintNumberNode.text)
        self.complaints_link = node.get_attribute("href")

  def get_landlord(self):
    driver.get(HPD_LINK)

    self.get_landlord_name()
    # if self.has_landlord:
    #   self.check_landlord_name()
    #   self.get_landlord_info()

  # Do check on landlord name

  def get_landlord_name(self):
    try:
      lot_block_el = driver.find_element_by_id("RadioStrOrBlk_1")
      lot_block_el.click()
      boroughSelect = driver.find_element_by_id("ddlBoro")
      for option in boroughSelect.find_elements_by_tag_name("option"):
        if option.text == self.borough:
          option.click()
        if self.borough == "Staten Island" and option.text == "Staten Is.":
          option.click()
      driver.find_element_by_id("txtBlockNo").send_keys(self.block_number)
      driver.find_element_by_id("txtLotNo").send_keys(self.lot_number)
      driver.find_element_by_id("btnSearch").click()
    except NoSuchElementException as exception:
      print "Element with id RadioStrOrBlk_1 on HPD not found... Starting again"
      time.sleep(.5)
      self.get_landlord_name()
      return
    except StaleElementReferenceException as exception:
      print "Stale element reference. Refreshing HPD page"
      self.get_landlord()

    try:  # Case that page loaded fine, address exists
      driver.find_element_by_id("lbtnRegistration").click()
      try:  # Case that landlord has registered information
        driver.find_element_by_id(
            "lblMessage").text == "Building Registration Summary Report"
        self.has_landlord = True
        first_name = driver.find_element_by_xpath(
            LANDLORD_FIRST_NAME_XPATH).text
        last_name = driver.find_element_by_xpath(LANDLORD_LAST_NAME_XPATH).text
        self.landlord_name = "{} {}".format(first_name, last_name).replace("'", "") # Kim O'Neale -> Kim ONeale
        print(self.landlord_name)
      except:  # Case that landlord does not have registered information
        print("No landlord information for: {}").format(self.building_id)
        self.has_landlord = False
    except NoSuchElementException as exception:  # Secondary page did not load
      try:
        driver.find_element_by_id("dgBldgs")
        trs = driver.find_elements(By.TAG_NAME, "tr")
        for tr in trs:
          tds = tr.find_elements(By.TAG_NAME, "td")
          current_row = None
          for td in tds:
            try:
              current_row = td.find_element(By.TAG_NAME, "input")
            except:
              spans = td.find_elements(By.TAG_NAME, "span")
              for span in spans:
                if span.text == self.building_id:
                  print("BUILDING ID FOUND")
                else:
                  print("BUILDING ID NOT FOUND")
      except NoSuchElementException as exception:  # No multiple apartments found
        print("No landlord found for bin = {}".format(self.building_id))
        self.has_landlord = False

  def get_building_footprint(self):
    dataset = requests.get(BUILDING_FOOTPRINT_LINK, params={
      "$limit": 1,
      "$where": "bin='{}'".format(
          self.building_id
    )}).json()

    try:
      height_roof = dataset[0]["heightroof"]
      # cur.execute("""
      #   update buildings
      #     set height_roof='{}'
      #     where building_id='{}'
      # """.format(
      #   height_roof,
      #   self.building_id
      # ))
      self.height_roof = height_roof
    except:
      print "Unable to get height roof for {}".format(self.building_id)

  def post_data(self, current_idx):
    post_building_query = POST_BUILDING_QUERY.format(
        BUILDING_FIELDS_TEXT,
        BUILDING_FIELDS_VARIABLES
    )
    query = post_building_query.format(
        self.building_id,
        self.building_number,
        self.street_name,
        self.zip_code,
        self.borough,
        self.num_of_res_units,
        self.city_council_district,
        self.latitude,
        self.longitude,
        self.block_number,
        self.lot_number,
        self.year_built,
        self.num_of_complaints,
        self.num_of_dob_violations,
        self.num_of_ecb_violations,
        self.complaints_link,
        self.dob_violations_link,
        self.ecb_violations_link,
        self.landlord_name,
        self.coordinates,
        self.height_roof
    )
    try:
      cur.execute(query)
      conn.commit()
    except psycopg2.Error as err:
      print(err)
      print("Failed to post #{}".format(current_idx))
      conn.rollback()
      time.sleep(1)
      self.post_data(current_idx)
      return

  def on_error(self, err_message):
    print("Error: {}".format(err_message))
