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

## Users

### GET /api/users.json?offset={offset}&limit={limit}

Returns all the users. 
If offset is specified then returns all the users from that offset. 
If limit is specified only {limit} users will be returned

#### required privileges

```json
["admin"]
```

#### example response data

```
HTTP/1.1 200 OK
Transfer-Encoding: chunked
Server: FinalServer
Etag: "1RKC70IN00OKPBUNG208OGB5G"
Date: Wed, 13 Feb 2013 20:14:50 GMT
Content-Type: text/plain;charset=utf-8
Cache-Control: must-revalidate

[
    {
        "id": "1",
        "username": "email@example.com",
    },
    {
        "id": "2",
        "username": "email2@example.com",
    },
    {
        "id": "3",
        "username": "email3@example.com",
    },
    {
        "id": "4",
        "username": "email4@example.com",
    },
]
```

### GET /api/users/{id}.json

Returns the user with given id or 404 if user does not exists

#### required privileges

`["client"]` if requesting information about himself or 

`["admin"]` if requesting information about others.

#### example success response

```
HTTP/1.1 200 OK
Server: FinalServer
Etag: "1-11f6035f13a60194d8f020b7bd1b1dc1"
Date: Wed, 13 Feb 2013 20:20:13 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 51
Cache-Control: must-revalidate

{
    id: '1',
    username: 'email@example.com',
}
```

#### example failure response

```
HTTP/1.1 404 Not Found
Server: FinalStore
Date: Wed, 13 Feb 2013 20:34:36 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 41
Cache-Control: must-revalidate

{error: 'not_found', reason: 'user_missing'}
```

### POST /api/users.json

Registers new user

#### required privileges

```json
["guest"]
```

#### creating guest user

In order to create a guest user send empty request data.
New user with login equal to his id and with random password 
will be created. 

#### example request data for named user

```json
{
    "username": "email@example.com",
    "password": "XXXXXX"
}
```

#### example response

```
HTTP/1.1 201 Created
Server: FinalStore
Location: http://finalstore.net/api/users/1
Date: Wed, 13 Feb 2013 19:58:44 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 30
Cache-Control: must-revalidate

{
    id: '1',
    ok: true,
}

```

### PUT /users/{id}.json

modify or create user with id = {id}

#### example request data

```json
{
    "password": "YYYYY"
}
```

#### example response data

```
HTTP/1.1 201 Created
Server: FinalStore
Location: http://finalstore.net/api/users/1
Etag: "2-26760bdac80441f55f6a53c66b83c336"
Date: Wed, 13 Feb 2013 20:31:56 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 30
Cache-Control: must-revalidate

{
    id: '1',
    ok: true,
}
```

### DELETE /api/users/{id}.json

Removes user from a store.

#### required privileges

`["user"]` if provided Authirization matches user id

`["admin"]` otherwise.

#### example response

```
HTTP/1.1 200 OK
Server: FinalStore
Etag: "2-80f57c5f774082b3d3f06ff0471b835e"
Date: Wed, 13 Feb 2013 20:41:05 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 30
Cache-Control: must-revalidate

{
    id: '3',
    ok: true,
}
```

#### possible error responses

```
HTTP/1.1 404 Not Found
Server: FinalStore
Date: Wed, 13 Feb 2013 20:41:55 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 41
Cache-Control: must-revalidate

{error: 'not_found', reason: 'missing'}
```


```
HTTP/1.1 401 Unauthorized
Server: FinalStore
Date: Wed, 13 Feb 2013 20:41:55 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 41
Cache-Control: must-revalidate

{error: 'nauthorized', reason: 'no_credentials'}
```


```
HTTP/1.1 403.3 Forbidden
Server: FinalStore
Date: Wed, 13 Feb 2013 20:41:55 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 41
Cache-Control: must-revalidate

{error: 'forbidden', reason: 'no_write_access'}
```

## Shopping Cart

### ACL related possible errors

```
HTTP/1.1 401 Unauthorized
Server: FinalStore
Date: Wed, 13 Feb 2013 20:41:55 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 41
Cache-Control: must-revalidate

{error: 'nauthorized', reason: 'no_credentials'}
```


```
HTTP/1.1 403.3 Forbidden
Server: FinalStore
Date: Wed, 13 Feb 2013 20:41:55 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 41
Cache-Control: must-revalidate

{error: 'forbidden', reason: 'no_write_access'}

#### user related possible error responses

```json
HTTP/1.1 404 Not Found
Server: FinalStore
Date: Sun, 17 Feb 2013 19:27:12 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 41
Cache-Control: must-revalidate

{ error: 'not_found', reason: 'user_missing' }
```

### GET /api/users/{user_id}/cart.json

Returns whole cart

`["user"]` if credentials match user with user_id
`["admin"]` otherwise

### example response

```
HTTP/1.1 200 OK
Server: FinalStore
Date: Sun, 17 Feb 2013 19:20:19 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 265
Cache-Control: must-revalidate

{
    "price": 1131.98,
    "quantity": 3,
    "products": [
        {
            "id": 1,
            "product_id": 90,
            "quantity": 2,
            "name": "Fiat 126p"
            "price": 520.99
        },
        {
            "id": 2,
            "product_id": 143,
            "quantity": 1,
            "name": "Stearing Wheel",
            "price": 90
        }
    ]
}
```

### GET /api/users/{user_id}/cart(price).json

Returns total value of all products placed in a shopping cart

`["user"]` if credentials match user with user_id

`["admin"]` otherwise

#### example response

```
HTTP/1.1 200 OK
Server: FinalStore
Date: Sun, 17 Feb 2013 19:20:19 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 24
Cache-Control: must-revalidate

{
    "price": 1131.98
}
```

### GET /api/users/{user_id}/cart(quantity).json

Returns number of items in cart

`["user"]` if credentials match user with user_id

`["admin"]` otherwise

#### example response

```
HTTP/1.1 200 OK
Server: FinalStore
Date: Sun, 17 Feb 2013 19:20:19 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 21
Cache-Control: must-revalidate

{
    "quantity": 3
}
```

### GET /api/users/{user_id}/cart(quantity,price).json

Returns number of items in cart and cart value

`["user"]` if credentials match user with user_id

`["admin"]` otherwise

#### example response

```
HTTP/1.1 200 OK
Server: FinalStore
Date: Sun, 17 Feb 2013 19:20:19 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 43
Cache-Control: must-revalidate

{
    "price": 1131.98,
    "quantity": 3
}
```

### GET /api/users/{user_id}/cart/products.json?offset={offset}&limit={limit}

Returns products in the shopping cart

#### required privileges

`["user"]` if credentials match user with user_id

`["admin"]` otherwise

#### example response

```
HTTP/1.1 200 OK
Server: FinalStore
Date: Sun, 17 Feb 2013 19:20:19 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 265
Cache-Control: must-revalidate

[
    {
        "id": 1,
        "product_id": 90,
        "quantity": 2,
        "name": "Fiat 126p"
        "price": 520.99
    },
    {
        "id": 2,
        "product_id": 143,
        "quantity": 1,
        "name": "Stearing Wheel",
        "price": 90
    }
]
```

### GET /api/users/{user_id}/cart/products/{cart_product_id}.json

Reads specific product from the cart

#### required privileges

`["user"]` if credentials match user with user_id

`["admin"]` otherwise

#### example response data

```json
HTTP/1.1 200 OK
Server: FinalStore
Date: Sun, 17 Feb 2013 19:20:19 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 100
Cache-Control: must-revalidate

{
    "id": 1,
    "product_id": 90,
    "quantity": 1,
    "name": "Fiat 126p"
    "price": 520.99
}
```

#### possible error responses

```json
HTTP/1.1 404 Not Found
Server: FinalStore
Date: Sun, 17 Feb 2013 19:27:12 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 41
Cache-Control: must-revalidate

{ error: 'not_found', reason: 'cart_product_missing' }
```

### GET /api/users/{user_id}/cart/products/{cart_product_id}(name,price).json

You can specify which attributes you want

#### required privileges

`["user"]` if credentials match user with user_id

`["admin"]` otherwise

#### example response data

```json
HTTP/1.1 200 OK
Server: FinalStore
Date: Sun, 17 Feb 2013 19:20:19 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 47
Cache-Control: must-revalidate

{
    "name": "Fiat 126p"
    "price": 520.99
}
```

#### possible error responses

```json
HTTP/1.1 404 Not Found
Server: FinalStore
Date: Sun, 17 Feb 2013 19:27:12 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 41
Cache-Control: must-revalidate

{ error: 'not_found', reason: 'cart_product_missing' }
```

### POST /api/users/{user_id}/cart/products.json

Insert product into cart

#### required privileges

`["user"]` if credentials match user with user_id

#### example request data

```json
{
    "product_id": 90,
    "quantity": 1,
}
```

#### example response data

```
HTTP/1.1 201 Created
Server: FinalStore
Location: http://finalstore.net/api/users/1/cart/products/3
Date: Wed, 13 Feb 2013 19:58:44 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 32
Cache-Control: must-revalidate

{
    "id": 3,
    "ok": true,
}
```

#### possible error responses

```json
HTTP/1.1 400 Bad Request
Server: FinalStore
Date: Sun, 17 Feb 2013 19:27:12 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 60
Cache-Control: must-revalidate

{"error": "bad_request", "reason": "cart_product_missing"}
```


```json
HTTP/1.1 400 Bad Request
Server: FinalStore
Date: Sun, 17 Feb 2013 19:27:12 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 54
Cache-Control: must-revalidate

{"error": "bad_request", "reason": "quantity_too_low"}
```


```json
HTTP/1.1 500 Internal Server Error
Server: FinalStore
Date: Sun, 17 Feb 2013 19:27:12 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 87
Cache-Control: must-revalidate

{"error": "internal_server_error", "reason": "quantity_too_high", "items_in_stock": 10}
```

### PUT /api/users/{user_id}/cart/products/{cart_product_id}.json

Update product in cart

#### required privileges

`["user"]` if credentials match user with user_id

#### example request data

```json
{
    "quantity": 10
}
```

#### example response

```
HTTP/1.1 201 Created
Server: FinalStore
Location: http://finalstore.net/api/users/1/cart/products/3
Etag: "2-26760bdac80441f55f6a53c66b83c336"
Date: Wed, 13 Feb 2013 20:31:56 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 33
Cache-Control: must-revalidate

{
    "id": 3,
    "ok": true,
}
```

#### possible error responses

```json
HTTP/1.1 400 Bad Request
Server: FinalStore
Date: Sun, 17 Feb 2013 19:27:12 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 60
Cache-Control: must-revalidate

{"error": "bad_request", "reason": "cart_product_missing"}
```


```json
HTTP/1.1 400 Bad Request
Server: FinalStore
Date: Sun, 17 Feb 2013 19:27:12 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 54
Cache-Control: must-revalidate

{"error": "bad_request", "reason": "quantity_too_low"}
```


```json
HTTP/1.1 500 Internal Server Error
Server: FinalStore
Date: Sun, 17 Feb 2013 19:27:12 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 87
Cache-Control: must-revalidate

{"error": "internal_server_error", "reason": "quantity_too_high", "items_in_stock": 10}
```

### DELETE /api/users/{user_id}/cart/products/{cart_product_id}.json

Removes item from cart

#### required privileges

`["user"]` if credentials match user with user_id

#### example response

```
HTTP/1.1 200 OK
Server: FinalStore
Etag: "2-80f57c5f774082b3d3f06ff0471b835e"
Date: Wed, 13 Feb 2013 20:41:05 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 32
Cache-Control: must-revalidate

{
    "id": 3,
    "ok": true,
}
```

#### possible error responses

```json
HTTP/1.1 400 Bad Request
Server: FinalStore
Date: Sun, 17 Feb 2013 19:27:12 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 60
Cache-Control: must-revalidate

{"error": "bad_request", "reason": "cart_product_missing"}
```


# Interesting links

- [A simple web service in node.js](http://blog.nodejitsu.com/a-simple-webservice-in-nodejs "With Basic Auth")
- [REST Api Tutorial](http://www.restapitutorial.com/ "Nice tips and status codes listing")
- [HTTP Status and Error Codes](http://kb.globalscape.com/KnowledgebaseArticle10141.aspx)
- [REST Web Service API - Naming Guidelines](http://www.soa-probe.com/2012/10/soa-rest-service-naming-guideline.html)