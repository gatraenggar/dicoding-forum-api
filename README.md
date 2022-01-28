# Dicoding-Forum-API
## What is this ?
A forum-like application on Rest API using Hapi.js. This app provides an interface for users to have an authentication with their account, post a thread like Twitter, and let anybody to comment & reply the thread. It is defined as the completion criteria of project submission for Dicoding's Becoming Backend Expert module.

This project is an implementation of the topics being taught in the learning module. The module covers about automation-testing, clean architecture, CI/CD using GitHub Action & AWS, security (eg. SQL injection, DDoS attack, Man in The Middle), and server scalability.

## How to test this in local environment ?
### Installation
#### 1. `git clone https://github.com/gatraenggar/dicoding-forum-api.git`
#### 2. `cd dicoding-forum-api`
#### 3. `npm install` to install the all dependencies needed

### Configuration
#### 4. Create two PostgreSQL databases for production & testing
#### 5. Rename `test_example.json` to `test.json`. Then change the  `db_user`, `db_password`, & `db_name` (for testing database only) value in that `test.json` file based on yours
#### 6. Rename `example.env` to `.env`. Then change the    `db_user`, `db_password`, & `db_name` value in that `.env` file based on yours
#### 6.1. Change `access_token_key` and `refresh_token_key` in `.env` file with your generated encryption keys
You can generate your own encryption keys with following steps:
1. Enter this site https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
2. Choose `Encryption key`
3. Check the `Hex ?` field
4. Click the `512-bit` option
5. Click `Get new results` button, then copy the generated string to the config file

### Run the App
#### 7. `npm run migrate:test up` to migrate/create the database table
#### 8. `npm run test:watch` to run the test
