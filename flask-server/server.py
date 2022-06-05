from flask import Flask

app = Flask(__name__)

# Members API Route

telegramArr = ["hello", "hello"]


@app.route("/members")
def members():
    return{"messages": telegramArr}


if __name__ == "__main__":
    app.run(debug=True)
