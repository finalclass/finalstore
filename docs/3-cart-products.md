## Shopping Cart

### ACL related possible errors

```ini
HTTP/1.1 401 Unauthorized
Server: FinalStore
Date: Wed, 13 Feb 2013 20:41:55 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 41
Cache-Control: must-revalidate

{error: 'nauthorized', reason: 'no_credentials'}
```


```ini
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

```ini
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

```ini
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

```ini
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

```ini
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

```ini
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

```ini
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

```ini
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

```ini
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
