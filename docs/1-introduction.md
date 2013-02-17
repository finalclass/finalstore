# FinalStore API

FinalStore is a RESTful API for typical online store.
It is written in [node.js](http://nodejs.org/).
For handling http it uses [express.js](http://expressjs.com/) framework.

FinalStore is an OpenSource project, 
distributed under **MIT** or **GPL** license (you can choose which license better suits your needs).

## Generally about the API

### GET /

Let's make first request.

Response for this request should look like that:

```
HTTP/1.1 200 OK
Server: FinalStore
Date: Wed, 13 Feb 2013 20:54:56 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 43
Cache-Control: must-revalidate

{version: '1.0.0', finalstore: 'Welcome'}
```

### Data format

You can specify a data format adding .format to the end of the url. (but before ? sign).
For example: request for getting all the users in html format could look like that:

`GET /api/users.html`

however getting only 10 first users as html: 

`GET /api/users.html?limit=10`

Possible formats are: **json, xml, html**

**default is json** so you are not obliged to specify format suffix.

In this tutorial however every request has its format specified.

**html** format is a sample html representation for the given resource.

### Selectors

Selectors are the method for selecing particular properties from the response. 
Not always we want all the data. Sometimes for the sake of bandwith we
want to read only data that we need. 
For this purpuse FinalStore offers selectors.

#### Selectors syntax

If you just need cart price and number of items in cart
you could make a request like that: 

`GET /api/users/1/cart(price,quantity).json`

Which could produce the response:

```
HTTP/1.1 200 OK
Server: FinalStore
Date: Wed, 13 Feb 2013 20:54:56 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 39
Cache-Control: must-revalidate

{
    "price": 100,
    "quantity": 2
}
```

This method works on all all resources.

#### Selectors and collections

You can even use it on colletions. For example: 

`GET /api/users(email).json` 

will return array of emails

### Nested selectors

If you want to get this kind of user data:

```json
{
    "email": "email@example.com",
    "cart": {
        "quantity": 3,
        "products": [
            {
                "id": 54,
                "quantity": 1
            },
            {
                "id": 22,
                "quantity": 2
            }
        ]
    }
}
```

You would write this request: 

`GET /api/users/2(email,cart(quantity,products(id,quantity))).json`

Nesting also works with collections, so 

`GET /api/users(email,cart(price)).json` 

could produce:

```json
[
    {
        "first@example.com",
        "cart": {
            "price": 253
        }
    },
    {
        "second@example.com",
        "cart": {
            "price": 78
        }
    }
]
```