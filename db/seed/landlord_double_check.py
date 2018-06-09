
import os
import ast
import numpy as np

from pg import *
from driver import *

def init():
  cur.execute("SELECT * FROM buildings")
  buildings = cur.fetchall()
  for building in buildings:
    if building[11] == None or building[18] == None:
      print("Double checking bin {}".format(building[0]))
      link = "https://www.realdirect.com/e/{}.".format(building[1])
      street_arr = building[2].split(" ")
      print(len(street_arr))

      for idx in xrange(len(street_arr)):
        if idx == len(street_arr) - 1:
          street_arr += "{}.".format(street_arr[idx])
          break
        link += "{}.".format(street_arr[idx])
      link += "{}".format(building[3])
      driver.get(link)
      title_arr = driver.title.split(" ")
      print(link)
      if title_arr[0] != "Property" and title_arr[1] != "Report":
        continue
      else:
        head_officer_el = driver.find_element_by_xpath(
            "//*[contains(text(), 'Head Officer')]")
        print(head_officer_el.text)

        print("helloooo")
      # else collect the data for the year built // landlord name
      # TO DO: Set up the actual looking for the data -- will probably have to do string checks

init()
