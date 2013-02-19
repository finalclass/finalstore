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

`GET /api/users/1/cart.json?select=(price,quantity)`

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

`GET /api/users.json?select=(email)`

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

`GET /api/users/2(email,cart.json?select=(quantity,products(id,quantity)))`

Nesting also works with collections, so 

`GET /api/users.json?select=(email,cart(price))` 

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

## Filtering results

It's possible to set the condition, so that only resources that satisfy the condition will be sent.
Conditions can be set using the `where` query part.

For example:

`GET /api/users.json?where=(email,email%40example.com)`

Will send only users with email equal to email@example.com

### LIKE operator example

If you would like to get all the users with emails from domain example.com you could create this url:

`GET /api/users.json?where=(email,*example.com)`

This will output all the users with emails parked at example.com domain.

### IN operator example

If you would like to get let's say 2 users, one with id equal to 3, and the other with id equal to 9 you could create this url:

`GET /api/users.json?where=(id,3,9)`

You can place as much values as you want in the round brackets. First value is the field name, and every proceding parameter is a possible value;

### AND operator example

Select every product from cart with name that starts from "foo" AND quantity is 2:

`GET /api/users/2/cart/products.json?whwere=(name,foo*)*(quantity,2)`

"*" between round brackets means AND

### OR operator example

Select every product from cart which name starts from "foo" OR quantity is 2:

`GET /api/users/2/cart/products.json?whwere=(name,foo*)+(quantity,2)`

"+" between round brackets means OR

### Greater then example

Get every product from cart which quantity is greater then 4:

`GET /api/users/2/cart/products.json?where=(quantity,gt$4)`

### Lower then example

Get every product from cart which quantity is lower then 4:

`GET /api/users/2/cart/products.json?where=(quantity,lt$4)`

### Between example

Get every product from cart which quantity is lower then 4 and greater then 2:

`GET /api/users/2/cart/products.json?where=(quantity,gt$2,lt$4)`

### Greater equal and lower equal example

Get every product from cart which quantity is lower or equal 4 and greater or equal 2:

`GET /api/users/2/cart/products.json?where=(quantity,ge$2,le$4)`

### Complex condition example

Get shopping cart content 
if there is more then 5 products in cart 
OR
there is a product which quantity is greater then 2 AND its price is greater then 100

`GET /api/users/2/cart.json?where=(quantity,gt$5)+((products.quantity,gt$2)*(products.price,gt$100))`