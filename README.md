# Easy Options Trader

A Python-based options trading automation tool that integrates with TD Ameritrade's API and provides a web interface for monitoring and managing trades.

## Features

- Automated options trading based on predefined strategies
- Real-time market data integration
- Web-based dashboard for monitoring positions
- Telegram notifications for trade alerts
- Secure API integration with TD Ameritrade

## Prerequisites

- Python 3.8+
- TD Ameritrade Developer Account
- Alpha Vantage API Key (for market data)
- Telegram Bot Token (for notifications)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/Easy-Options-Trader.git
cd Easy-Options-Trader
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```
TD_AMERITRADE_API_KEY=your_api_key
TD_AMERITRADE_ACCOUNT_ID=your_account_id
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

4. Download ChromeDriver:
   The project uses Selenium for web automation. Download the appropriate ChromeDriver version for your system and place it in the project root.

## Project Structure

- `connect.py`: TD Ameritrade API integration
- `telegram.py`: Telegram bot for notifications
- `sandbox.py`: Testing environment for strategies
- `flask-server/`: Web dashboard backend
- `client/`: Frontend web interface

## Usage

1. Start the web server:

```bash
cd flask-server
python app.py
```

2. Run the main trading script:

```bash
python connect.py
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This software is for educational purposes only. Do not risk money which you are afraid to lose. USE THE SOFTWARE AT YOUR OWN RISK. THE AUTHORS AND ALL AFFILIATES ASSUME NO RESPONSIBILITY FOR YOUR TRADING RESULTS.
