# tauria-graphql

[![Actions Status](https://github.com/leonardomso/rehawk/workflows/CI/badge.svg)](https://github.com/leonardomso/rehawk/actions)

Code challenge for Tauria using GraphQL.

## Getting Started

1. Move to the appropriate directory: `cd tauria-graphql`.
2. Create a `.env` file in the root directory of the project and add the following environment variables:

```dosini
DB_URI=mongodb+srv://trauria:12345@trauria-graphql.3tjs3.mongodb.net/users?retryWrites=true&w=majority
DB_PASSWORD=12345
GRAPHQL_PORT=4000
JWT_SECRET=WizHRlpR2D
```
3. Run `yarn` or `npm install` to install dependencies.
4. Run `yarn start` or `npm start` to see the API working at `http://localhost:4000/graphiql`.