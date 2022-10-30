import json
import os
import requests

def lambda_handler(event, context):
  lat = json.loads(event['body'])['lat']
  lon = json.loads(event['body'])['lon']
  appid = os.environ['API_KEY']

  open_weather_url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={appid}'

  weather_data = requests.get(open_weather_url)

  if weather_data.json()['cod'] == '404':
    return { 'isRaining': False }
  else:
    weather = weather_data.json()['weather'][0]['main']
    raining = ['Thunderstorm', 'Drizzle', 'Rain']
    return { 'isRaining': weather in raining }
