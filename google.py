'''
Ask Alexa anything!

Try:
- "can you use dish soap in a dishwasher"
- "how to fix a cold"	
- "who is taylor swift"
- "what time is it in india"
- "how many calories are there in a matcha latte from starbucks"
- "How long does it take to get to macau from hong kong"
- "how many feet in a mile"
- "How big is the sun?"
'''

import requests, sys

from bs4 import BeautifulSoup

tests = ["can you use dish soap in a dishwasher",
		 "how to fix a cold",
		 "who is taylor swift",
		 "what time is it in india",
		 "how many calories are there in a matcha latte from starbucks",
		 "How long does it take to get to macau from hong kong",
		 "how many feet in a mile",
		 "How big is the sun?",
		 "what color is the sky"]

for phrase in tests:
	
	url = "https://www.google.com/search?q=" + phrase
	headers = {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'}
	result = requests.get(url, headers=headers)

	# turn page into beautiful soup for parsing
	soup = BeautifulSoup(result.text)

	speech_output = ""
	try:
		# default text container
		modules = soup.find_all("div", {"class":"mod"})
		speech_container = modules[0]

		# in case the first part is nonsense code
		if speech_container.get_text().strip()[0] == '{' or speech_container.get_text().strip()[-1] == '}':
			speech_container = modules[1]

		# get text from default container
		speech_output = speech_container.get_text()

		# if asking for numerical stat, append to header
		stat = soup.find_all("div", {"class":"_XWk"})
		if len(stat) > 0 and stat[0].get_text() != speech_output:
			speech_output += stat[0].get_text()

		# parse result for unit conversions
		conversions = speech_container.find_all("input", {"class":"_eif"})
		if len(conversions) > 0:
			speech_output = conversions[1].get('value')	
		
	except:
		print("Unexpected error:" + str(sys.exc_info()[0]))
		speech_output = "Sorry, I couldn't find an answer to your question"

	print speech_output
