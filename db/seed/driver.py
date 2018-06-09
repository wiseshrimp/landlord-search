from selenium import webdriver
from selenium.webdriver import FirefoxOptions

# To enable Chrome:
# driver = webdriver.Chrome("/Users/sueroh/chromedriver")

opts = FirefoxOptions()
opts.add_argument("--headless")
driver = webdriver.Firefox(
    executable_path="/Users/sueroh/geckodriver",
    firefox_options=opts)
