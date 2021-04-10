const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

// Create a schema
const schema = buildSchema(`
type About {
  message: String!
  time: String!
}

type Meal {
    description: String!
    calories: Int!
}

type Query {
  getAbout: About
    getmeal: [Meal]
}`);

// Define a resolver
const root = {
	getAbout: () => {
		return { message: "Hello World" ,
                time: new Date().toString()
    };
	},
	getmeal: () => {
		return [
            { description: "Pizza", calories: 500},
            {description: "hamburger", calories: 700}
        ];
	},
};

// Create an express app
const app = express();

// Define a route for GraphQL
app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		rootValue: root,
		graphiql: true,
	})
);

// Start this app
const port = 4000;
app.listen(port, () => {
	console.log(`Running on port: ${port}`);
});
