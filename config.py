import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# TD Ameritrade Configuration
TOKEN_PATH = os.getenv('TOKEN_PATH', 'token')
API_KEY = os.getenv('TD_AMERITRADE_API_KEY')
REDIRECT_URI = os.getenv('TD_AMERITRADE_REDIRECT_URI', 'https://localhost')
ACCOUNT_ID = os.getenv('TD_AMERITRADE_ACCOUNT_ID')

# Alpha Vantage Configuration
ALPHA_VANTAGE_API_KEY = os.getenv('ALPHA_VANTAGE_API_KEY')

# Telegram Configuration
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')

# Flask Configuration
FLASK_ENV = os.getenv('FLASK_ENV', 'development')
FLASK_APP = os.getenv('FLASK_APP', 'flask-server/app.py')

# Validate required environment variables
required_vars = ['TD_AMERITRADE_API_KEY', 'TD_AMERITRADE_ACCOUNT_ID', 'ALPHA_VANTAGE_API_KEY']
missing_vars = [var for var in required_vars if not os.getenv(var)]

if missing_vars:
    raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_vars)}")

access_token = 'eLOVMICywisqUINFG4nUa5jhiI2tEN7Krq6RV0OlYqpvEh7TcLQ6r1htuGnhCpfY/D/iuGVPX+8zFCDKWQVJ5NFnDOEZC/Oq/QzJRa0zn5MKw7DKdcc+rn2Roy5M8sZPMDymdpWkOrkAb3pB+/RPkF+l1qYhrHCDboRJAE3d4MYCOTVgF0/bK98Crux2aLyBWf/KE1Rnz1nFtpDvTTFRoEsWtlsZ6L139ld6tOSkHdPaxGyYSDvsg3/Yfohi7EuqVRinjnuKe+b14xbedD7Rb+rI226eD51pFWuV0tk7gsjcQPB3OrMikb5IprOYQ46tclnrltJ9O7yUqg9qOhvkApIyXvXCD3cWIwXgV2MS62oK0BPHGAivTCFIdWeMgvB9IkNCUhIqhc+GXG8iqx+76Ib+/QZVPQ8ee8cD7sbMMzDkwnq8uJXD6e/XlIpixd4xVY4Vk1n14k6h75VBJRhLttttDcL4iVkI7KMFkF7fmz0xbqdSkOkUMxn1jRpywCIzkqnSJoiHZl5QsXf8LIgjcIpS4GEevxQ+plwB14Gsr5ZbQu/1i100MQuG4LYrgoVi/JHHvlGrID2EPmxqpEHcB0nEkbBt36mHWO0FhK0mtxXnKSZajW5EeJQD624I5j6IqGeK8DGrHlHMVFCo+BxSrfqbgf/WPIWxVIwDbgab8sY3uuV/52xeB5slPU81+/0JpqbUjsqDEacsAl6lCxRhJuHSkUUYDbNPaY1u5ZFz8JH2Rl0A7j94g0u8N+ZEFNPDjcKUPuk5kKrXrVG0ZtTOr7invtVWahJ4cNrJuUTi/e2wmZTG9sbWl8nAdrzaGKthnSlH9VZd/Z6/YLXjBPxWsrqBtwMq6WBuGGsCbQdIurvIiqtP4ByclPfFxltOwG9lkRjD44Aqvc6qCWFHUjxPP3Jc424WMBp0NKJ6yAerHdcttJN+wlHEaAbgsiyHTAJfmUkOV7iFsH+mumGTAXC3XFFbSdQ+MNsueT3sQHigQw6fsQbPwevyMYBQA9nWqqVmpyIYwc1MWNsDPSyZYetOpbh62Ofq/h79u4+VKJcCQNizmfkzueB0E6Yt4nhpc/XBSA+f7HI96xiYNhkfyeoJ6CCAdQFWfF3aNQKTx5RGbkBzSq7aaqroKA==212FD3x19z9sWBHDJACbC00B75E'