## Running the user-app

```shell
docker pull ayush272002/payments-app-user-app:latest
docker run -e JWT_SECRET="" -e  NEXTAUTH_URL="http://localhost:3000" -e DATABASE_URL="" -p 3000:3000 ayush27002/payments-app-user-app
```

## Running the webhook
```shell
docker pull ayush272002/payments-app-bank-webhook:latest
docker run -e DATABASE_URL="" -p 3002:3002 ayush27002/payments-app-bank-webhook
```