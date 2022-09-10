# fragments

Fragments back-end API

This is a node.js based REST API using Express.

# Development server

Run `npm install` to install node modules before running the application

Run any options below for a dev server. Navigate to http://localhost:8080/.

```sh
npm start     // starts server normally.
npm run dev   // runs the server via nodemon and uses cross-env package to override
                the default values for the environment variables on Windows Shell.
npm run debug // serves as dev mode. However, it runs node inspector on port 9229,
                where a debugger can be attached to.

```

## Running unit tests

`npm run test` : there is no test yet.

## Running grammar, syntax, useless code Checker

`npm run lint` : to enable checking for grammar errors and syntax errors for files
under src/ folder.

## Note for myself

#### 1. There are some options to install a package

`npm install options library-name`

options:

- --save : install production Dependency
- --save-dev : install Development Dependency
- --save-exact: install exact version of dependencies

#### 2. How to commit changes and push to github repository

```sh
git status
git add modified-files
git commit -m "Updated files modified"
git push origin
```
