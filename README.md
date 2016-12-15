# SakuraOutgoingWebhookListener
An nodejs project for heroku to listen outgoing webhook from sakuraIoT platform.

# Deploy to Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

# Test
You can test webhook posting with using curl command.

```
curl [your-app-url] \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"module":"your-module-id","type":"channels","datetime":"2016-12-07T14:00:39.654936118Z","payload":{"channels":[{"channel":0,"type":"f","value":30,"datetime":"2016-12-07T14:00:39.608938287Z"},{"channel":1,"type":"f","value":1.25,"datetime":"2016-12-07T14:00:39.620938287Z"},{"channel":2,"type":"f","value":22,"datetime":"2016-12-07T14:00:39.632938287Z"},{"channel":3,"type":"f","value":27.5,"datetime":"2016-12-07T14:00:39.643938287Z"}]}}'
```

# License
MIT