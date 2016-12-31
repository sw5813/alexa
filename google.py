'''
Ask Alexa anything!

Try:
- "can you use dish soap in a dishwasher"
- "how to fix a cold"	
- "who is taylor swift"
'''

import requests, sys

from bs4 import BeautifulSoup

url = "https://www.google.com/search?q=" + "columbia core curriculum reading list"
headers = {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'}
result = requests.get(url, headers=headers)

# turn page into beautiful soup for parsing
soup = BeautifulSoup(result.text)

speech_output = ""
try:
	speech_output = soup.find_all("div", {"class":"_OKe"})[0].find_all("div", {"class":"mod"})[-1].get_text()
except:
	print("Unexpected error:" + str(sys.exc_info()[0])
	speech_output = "Sorry, I couldn't find an answer to your question"

print speech_output
