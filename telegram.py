import json

items = json.loads('[{"id" : 1},{"id" : 2}]')

for item in items:
    print(item["id"])
