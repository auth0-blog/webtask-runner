# Webtask Runner

This is a web server made in Node which runs WebTasks.

## Features
* It **runs WebTasks*. Learn more about them at [this blog post](http://tomasz.janczuk.org/2015/04/rethinking-backend-with-webtasks.html)
* It's **single tenant and runs the tasks as `eval`s**

## Installing it

First, clone the repository and run `npm install`. Then, modify `.env` file a piaccere and then just run `node start.js` :boom:.

## Simple usage example

This server has no UI, but you can use its API.

For example, with the following code (and without changing the JWT_SECRET from the `.env` file), you can run the hello world in the server which will use the query parameter who to state the person's name.

```bash
curl 'http://127.0.0.1:3001/run?who=my%20dear%20friend' -H 'Content-Type: text/plain;charset=UTF-8' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.gHR70RJsym-H6-b0ebw5ozTYNztVDvQRS_GjTJ2ZMd4' --data-binary 'return function(ctx, cb) { cb(null, {message: "Hello " + ctx.who}); }'
```


## API

### POST `/create-token`

Posting to this API, you can create new tokens which have the following functionality:

* Control the access to who can call the Server
* Set public parameters which can be accessed by the WebTask (via `pctx` field in the body)
* Set private (encrypted) parameters which can be accessed by the WebTask (via `ectx` field in the body)
* Retrieve the code from a URL instead of embedding it in the body when used by the `/run` endpoint (via `code_url` field in the body)

In order to create a new token, you must send a basic token in the Header that is signed with the `JWT_SECRET` configured in the `.env`. To create a base token using that secret, you can use [jwt.io](http://jwt.io)

#### Examples

> **Tip**: Inspect the created tokens in [jwt.io](http://jwt.io) to see how it's created and what fields it has.

##### 1. Create a new token that specifies a `code_url` to a gist file

```bash
curl 'http://127.0.0.1:3001/create-token' -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.gHR70RJsym-H6-b0ebw5ozTYNztVDvQRS_GjTJ2ZMd4' --data-binary '{ "code_url": "https://gist.githubusercontent.com/mgonto/c59dd2e16f7171537754/raw/cedb78612ef844684e6af58ef8751409b2589626/code.js"}'
```

##### 2. Creates a new token with encrypted variables

```bash
curl 'http://127.0.0.1:3001/create-token' -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.gHR70RJsym-H6-b0ebw5ozTYNztVDvQRS_GjTJ2ZMd4' --data-binary '{ "ectx": {"field": "the value"}}'
```

##### 3. Creates a new token with public variables

```bash
curl 'http://127.0.0.1:3001/create-token' -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.gHR70RJsym-H6-b0ebw5ozTYNztVDvQRS_GjTJ2ZMd4' --data-binary '{ "pctx": {"field": "the value"}}'
```


### POST `/run`

Posting to this API with a token in the header, you can run a WebTask in the server.

#### Examples

##### 1. Run some code from a gist (via code_url on the token)

```bash
curl 'http://127.0.0.1:3001/run' -X POST -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiY29kZV91cmwiOiJodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21nb250by9jNTlkZDJlMTZmNzE3MTUzNzc1NC9yYXcvY2VkYjc4NjEyZWY4NDQ2ODRlNmFmNThlZjg3NTE0MDliMjU4OTYyNi9jb2RlLmpzIiwiaWF0IjoxNDI4OTU5MjQ4LCJleHAiOjE0Mjk4MjMyNDgsImF1ZCI6IndlYnRhc2stcnVubmVyIn0.VpcMnh6-g-JEWNEJ2EegouMMjp6e93Eqrw5JiB2-eG8'
```

##### 2. Run some code that uses encrypted variables

```bash
curl 'http://127.0.0.1:3001/run' -H 'Content-Type: text/plain;charset=UTF-8' -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZWN0eCI6ImhlU1VKcDI2SGxBZDdLdXFDcWhyeExzTVpJWitHd2lhUndBeHhxQ29YS1E9LllyYW1GOVF5cHB4VWxxWHd1RHV6dUE9PSIsImlhdCI6MTQyODk1OTkxMiwiZXhwIjoxNDI5ODIzOTEyLCJhdWQiOiJ3ZWJ0YXNrLXJ1bm5lciJ9.7aWIjjT-jxCQD-YSZJufuUSyGmurzoXyx8yx-k6wYWw' --data-binary 'return function(ctx, cb) { cb(null, {message: "Hello " + ctx.field}); }'
```

##### 3. Run some code that uses public variables

```bash
curl 'http://127.0.0.1:3001/run' -H 'Content-Type: text/plain;charset=UTF-8' -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicGN0eCI6eyJmaWVsZCI6InRoZSB2YWx1ZSJ9LCJpYXQiOjE0Mjg5NTk5ODUsImV4cCI6MTQyOTgyMzk4NSwiYXVkIjoid2VidGFzay1ydW5uZXIifQ.uwWwpYwlyvkXIdACiZN3CI0cIfD8aQWn2dVPQ1RSdKE' --data-binary 'return function(ctx, cb) { cb(null, {message: "Hello " + ctx.field}); }'
```

## License

This project is licensed under the MIT license.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, amont others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free account in Auth0

1. Go to [Auth0](https://auth0.com) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.



