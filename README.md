
# AUTHRM

A `npm` package for authentication.

## Tech Stack

**Server:** `Node`


## Requirements
Your `user model` should contain atleast these points.

```javascript
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
```

## How to use?
### Import
Import this package using `npm i authrm`

### Configuration
```javascript
authrm.config(userModel, tokenSecret, tokenExpiry);
```
* `userModel`: This is path to your user model.
* `tokenSecret`: This is JWT token secret-key you want to set.
* `tokenExpiry`: This is JWT token expiry time.

### functionalities
1. SignIn
```javascript
authrm.signIn(req,res);
```
* This takes `req` and `res` objects as a parameter.
* This returns an object.
    * If there are no errors occured then object contains `status code` as `status`, `user` which has been signed in or signed up, `message` and `jwt token`.
    ```javascript
    return {
                status,
                user,
                message,
                token
            };
    ``` 
    * If there is error then object contains `status code` as `status` and `error` which specifies the error.
    ```javascript
    return {
                status,
                error
            }
    ```

2. SignUp
```javascript
authrm.signUp(req,res);
```
* This also returns same objects as signIn.

3. SignOut
```javascript
authrm.signOut(req,res,tokenName);
```
* This takes an extra parameter called `tokenName` which is the token you want to delete on signout function.

* This will return an object containing `status` and `message` fields in case of no errors. And in case of errors it will return an object containing `status` and `error` fields.

4. Change password
```javascript
authrm.changePassword(req,res);
```
* This checks weather user has entered correct current password.
* If yes then replaces the password and returns an object containing `status`, `message` and `user` fields.
* In case of error it returns an object containing `status` and `error` fields.