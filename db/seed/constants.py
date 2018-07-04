BIS_LINK = "http://a810-bisweb.nyc.gov/bisweb/bispi00.jsp"
HPD_LINK = "https://hpdonline.hpdnyc.org/HPDonline/provide_address.aspx"
BUILDING_FOOTPRINT_LINK = 'https://data.cityofnewyork.us/resource/uve3-pyf6.json'

API_KEY = 'BNNnFOQp0lauIJBAcIph6SnJVHXJyAlOkxWGmOh1ZyvvzfSNBGP2f'

# e895e31c-7233-4474-bc4d-889eee172a8b
ENIGMA_BUILDINGS_ID = "5f757050-1289-4019-ab9c-bc4b920be226"


HEADERS = {
    'authorization': 'Bearer ' + API_KEY
}
BASE_URL = "https://public.enigma.com/api/"

# BOROUGHS = {
#     "BX": "Bronx",
#     "BK": "Brooklyn",
#     "QN": "Queens",
#     "MN": "Manhattan",
#     "SI": "Staten Island"
# }

BUILDING_FIELDS_TEXT = """
    building_id, 
    building_number, 
    street_name, 
    zip_code, 
    borough, 
    num_of_res_units, 
    city_council_district, 
    latitude, 
    longitude, 
    block_number, 
    lot_number, 
    year_built, 
    num_of_complaints, 
    num_of_dob_violations, 
    num_of_ecb_violations, 
    complaints_link, 
    dob_violations_link, 
    ecb_violations_link,  
    landlord_name,
    coordinates,
    height_roof
"""

# LANDLORD_FIELDS_TEXT = """
#     landlord_name varchar,
#     reg_organization varchar,
#     reg_building_number varchar,
#     reg_building_street varchar,
#     reg_building_city varchar,
#     reg_building_state varchar,
#     reg_building_zip_code varchar
# """

# LANDLORD_FIELDS_VARIABLES = """
#     '{}',
#     '{}',
#     '{}',
#     '{}',
#     '{}',
#     '{}',
#     '{}'
# """

BUILDING_FIELDS_VARIABLES = """
    {},
    {},
    '{}',
    '{}',
    '{}',
    {},
    {},
    '{}',
    '{}',
    {},
    {},
    '{}',
    {},
    {},
    {}, 
    '{}', 
    '{}', 
    '{}', 
    '{}',
    '{}',
    '{}'
"""

ENIGMA_PARAMS = "{}datasets/{}?&row_offset={}&row_limit={}"
ADDRESS_COORDINATES_PARAMS = "{} {}, {}, NY, {}"

# CREATE_LANDLORDS_QUERY = """
#     CREATE TABLE landlords
#         (
#             id int NOT NULL,
#             landlord_name varchar,
#             reg_organization varchar,
#             reg_building_number integer,
#             reg_building_street varchar,
#             reg_building_city varchar,
#             reg_building_state varchar,
#             reg_building_zip_code varchar,
#             CONSTRAINT UC_Landlord UNIQUE(landlord_name)
#         );
# """

"""
    WITH landlord_name AS
        INSERT INTO buildings(landlord_name) VALUES(
            {}
        )
"""

CREATE_BUILDINGS_QUERY = """
    CREATE TABLE buildings 
        (
            building_id integer, 
            building_number varchar, 
            street_name varchar, 
            zip_code varchar, 
            borough varchar, 
            num_of_res_units integer, 
            city_council_district integer, 
            latitude varchar, 
            longitude varchar, 
            block_number integer, 
            lot_number integer, 
            year_built varchar, 
            num_of_complaints integer, 
            num_of_dob_violations integer, 
            num_of_ecb_violations integer, 
            complaints_link varchar, 
            dob_violations_link varchar, 
            ecb_violations_link varchar, 
            landlord_name varchar,
            coordinates varchar, 
            height_roof varchar
    );
"""

DUPLICATE_COUNT_QUERY = """
    SELECT COUNT(*)
        FROM buildings
        WHERE building_id = {}
"""

# LANDLORD_NAME_QUERY = """
#     SELECT id
#         FROM landlords
#         WHERE landlord_name = '{}'
# """

POST_BUILDING_QUERY = "INSERT INTO buildings({}) VALUES({})"
# POST_LANDLORD_QUERY = "INSERT INTO landlords({}) VALUES({})"

DEFAULT_TITLE = "DOB Building Information Search"
PROPERTY_PROFILE_TITLE = "Property Profile Overview"

BUILDING_ID_XPATH = "//td[contains(@class, 'maininfo')][@align='right']"
DOB_VIOLATIONS_XPATH = "//html/body/center/table[8]/tbody/tr/td[1]/table/tbody/tr[3]/td[2]"
ECB_VIOLATIONS_XPATH = "//html/body/center/table[8]/tbody/tr/td[1]/table/tbody/tr[4]/td[2]"
COMPLAINT_XPATH = "//html/body/center/table[8]/tbody/tr/td[1]/table/tbody/tr[2]/td[2]"
LANDLORD_ORG_XPATH = '//*[@id="dgRegistration"]/tbody/tr[4]/td[3]'
LANDLORD_BUILDING_NUMBER_XPATH = '//*[@id="dgRegistration"]/tbody/tr[4]/td[6]'
LANDLORD_BUILDING_STREET_XPATH = '//*[@id="dgRegistration"]/tbody/tr[4]/td[7]'
LANDLORD_BUILDING_CITY_XPATH = '//*[@id="dgRegistration"]/tbody/tr[4]/td[9]'
LANDLORD_BUILDING_STATE_XPATH = '//*[@id="dgRegistration"]/tbody/tr[4]/td[10]'
LANDLORD_BUILDING_ZIP_XPATH = '//*[@id="dgRegistration"]/tbody/tr[4]/td[11]'
LANDLORD_FIRST_NAME_XPATH = '//*[@id="dgRegistration"]/tbody/tr[2]/td[5]'
LANDLORD_LAST_NAME_XPATH = '//*[@id="dgRegistration"]/tbody/tr[2]/td[4]'

# GEOJSON


GEOJSON_FEATURES = [
    "building_id",
    "building_number",
    "street_name",
    "zip_code",
    "borough",
    "num_of_res_units",
    "city_council_district",
    "latitude",
    "longitude",
    "block_number",
    "lot_number",
    "year_built",
    "num_of_complaints",
    "num_of_dob_violations",
    "num_of_ecb_violations",
    "complaints_link",
    "dob_violations_link",
    "ecb_violations_link",
    "landlord_name",
    "coordinates",
    "height_roof"
]
