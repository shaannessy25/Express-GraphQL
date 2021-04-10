

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

// Create a schema
const schema = buildSchema(`

	enum Species {
		Dog
		Cat
		Frog
		Fish
	}

	type Pets {
		name: String!
		species: Species!
		age: Int!
	}

	type Query {
		allPets: [Pets!]!
	}

`);

const petList = [
    { name: 'Fluffy', species: 'Dog', age: 3 },
    { name: 'Sassy', species: 'Cat', age: 4 },
    { name: 'Goldberg', species: 'Frog', age: 1 }
]

//Define a resolver
const root = {
	allPets: () => {
		return petList
	}
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
