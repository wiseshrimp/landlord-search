import psycopg2
import requests
from cStringIO import StringIO
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
import os
import sys
import getopt
import pyPdf

from pg import *

dataWithout = cur.execute("select * from buildings")
rows = cur.fetchall()
url = "https://www1.nyc.gov/assets/rentguidelinesboard/pdf/2016manhattanbldgs.pdf"

#converts pdf, returns its text content as a string

def convert(fname, pages):
  set()
  pdf = pyPdf.PdfFileReader(fname, "r")
  infile = file(fname, 'rb')
  num_of_pages = pdf.getNumPages()
  output = StringIO()
  manager = PDFResourceManager()
  converter = TextConverter(manager, output, laparams=LAParams())
  interpreter = PDFPageInterpreter(manager, converter)

  print(infile)
  for page in PDFPage.get_pages(infile, pages):
      interpreter.process_page(page)
  infile.close()
  converter.close()
  text = output.getvalue()
  output.close
  return text

def check_if_rent_stabilized():
  rent_stab_bldgs = convert("db/seed/2016manhattanbldgs.pdf", 252)
  print rent_stab_bldg

check_if_rent_stabilized()
