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

```ini
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

```ini
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

```ini
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

```ini
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

```ini
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

```ini
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

```ini
HTTP/1.1 404 Not Found
Server: FinalStore
Date: Wed, 13 Feb 2013 20:41:55 GMT
Content-Type: text/plain;charset=utf-8
Content-Length: 41
Cache-Control: must-revalidate

{error: 'not_found', reason: 'missing'}
```


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
```