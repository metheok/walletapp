# Wallet app 

App is live on https://walletappnode.herokuapp.com/

api requests on https://walletappnode.herokuapp.com/api

## Quick start

    git clone git@github.com:metheok/walletapp.git
    cd walletapp/
    npm install


    npm start                                                   #run backend/server of the app on 4000 port
    cd client
    npm install
    npm start                                                   #run frontend of the app on 3000 port

# REST API

The REST API to the example app is described below.

API runs on http://localhost:4000/api

## Ping test

### Request

`GET /ping/`

    curl -i -H 'Accept: application/json' http://localhost:4000/api/ping

### Response

    HTTP/1.1 200 OK
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 2

    {"message": "ping recieved!"}

## Setup wallet

### Request

`POST /setup/`

    curl -i -H 'Accept: application/json' -d 'name=name&balance=50' http://localhost:4000/api/setup

### Response

    HTTP/1.1 200 Created
    Status: 200 Created
    Connection: close
    Content-Type: application/json
    Location: /thing/2
    Content-Length: 35

    {
        "name": "name",
        "date": "2022-11-16T06:36:45.010Z",
        "transactionID": "637484fd13cb8e967f2ace1f",
        "balance": "223.0000",
        "walletID": "637484fc13cb8e967f2ace1d"
        }

## Transact on wallet

### Request

`POST /transact/:walletID`

    curl -i -H 'Accept: application/json' -d "amount=-33&description='init transaction'" http://localhost:4000/api/transact/63746b7eb3b4564bfc59b8b4

### Response

    HTTP/1.1 200 Created
    Status: 200 Created
    Connection: close
    Content-Type: application/json
    Location: /thing/2
    Content-Length: 35

    {
         "data": {
        "transactionID": "637492c0f0b8f1a0861124fa",
        "balance": "-33.0000",
        "walletID": "63746b7eb3b4564bfc59b8b4"
    }
        }

## Get Wallet details

### Request

`GET /wallet/:walletID`

    curl -i -H 'Accept: application/json' http://localhost:4000/api/wallet/63746b7eb3b4564bfc59b8b4

### Response

    HTTP/1.1 200 OK
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 74

"data": {
"created_date": "2022-11-16T04:47:58.630Z",
"updated_date": "2022-11-16T04:47:58.634Z",
"balance": "88.4444",
"name": "wallet new",
"walletID": "63746b7eb3b4564bfc59b8b4"
}

## Get transactions for a wallet

### Request

`GET/transactions/:walletID?skip&limit=&sort=amount` # sort = 'amount' or 'date' ; limit=Number ; skip=Number

    curl -i -H 'Accept: application/json' http://localhost:4000/api/transactions/63746b7eb3b4564bfc59b8b4?skip&limit=2&sort=amount

### Response

    HTTP/1.1 200 OK
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 40

    {
    "data": {
        "length": 2,
        "walletID": "63746b7eb3b4564bfc59b8b4",
        "transactions": [
            {
                "_id": "63746c2cd6f605f6dd99eefc",
                "walletID": "63746b7eb3b4564bfc59b8b4",
                "type": "credit",
                "amount": "111.3356",
                "balance": "0.4444",
                "date": "2022-11-16T04:50:52.782Z"
            },
            {
                "_id": "63747a7de489fec538d26432",
                "walletID": "63746b7eb3b4564bfc59b8b4",
                "type": "credit",
                "amount": "55.0000",
                "balance": "55.4444",
                "date": "2022-11-16T05:51:57.333Z"
            }

        ]
    }

}
