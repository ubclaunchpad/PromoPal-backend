** How to setup a Todo app with postgres
- build postgres db
    1. make your database of postgresql
    2. write your postgres url in dbconnector.ts
- build an app
    ```npm run build
    ```
- start an app
    ```npm start
    ```
*** how to get data
- if you want to get all rows => "http://localhost:4000/todos/list"
- if you want to get a row with id => "http://localhost:4000/todos/?id=1"