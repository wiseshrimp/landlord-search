import psycopg2
import json
from constants import *
# Connect to an existing database
conn = psycopg2.connect("dbname=landlord-dev user=postgres")

# Open a cursor to perform database operations
cur = conn.cursor()
