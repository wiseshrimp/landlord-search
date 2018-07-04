import os
import ast
import numpy as np
import requests

from pg import *
from driver import *

GOOGLE_MAPS_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?address="
API_KEY = "AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg"

GOOGLE_AUTOCOMPLETE_BASE_URL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="
AUTOCOMPLETE_PARAMS = "&location=40.730610,-73.935242&key={}".format(API_KEY)

def init():
  cur.execute("SELECT * FROM buildings")
  buildings = cur.fetchall()
  for building in buildings:
    print("Double checking address for bin {}".format(building[0]))
    street = building[2].replace(" ", "+")


    autocomplete_fetch_link = "{}{}+{}{}".format(GOOGLE_AUTOCOMPLETE_BASE_URL, building[1], street, AUTOCOMPLETE_PARAMS)
    print(autocomplete_fetch_link)
    try:
      data = requests.get(autocomplete_fetch_link).json()
      print(data)
    except requests.exceptions.RequestException as e:  # This is the correct syntax
        print e

    # borough = building[4].replace(" ", "+")
    # fetch_link = "{}{}+{},+{},+NY&key={}".format(
    #   GOOGLE_MAPS_BASE_URL,
    #   building[1],
    #   street,
    #   borough,
    #   API_KEY
    # )
    # print(fetch_link)
    # try:
    #   data = requests.get(fetch_link).json()
    #   print(data)
    # except:
    #   print("uh oh")

init()
