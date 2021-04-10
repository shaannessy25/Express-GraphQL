const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

// Create a schema
const schema = buildSchema(`

	enum Species {
		Dog
		Cat
		Frog
	}

	type nameOfSpecies {
		name: Species!
	}

	type Pet{
		name: String!
		species: Species!
		age: Int!
	}

	type Time{
		hour: String!
		minute: String!
		seconds: String!
	}

	type Dice{
		total: Int!
		sides: Int!
		roll: [Int]
	}
	type Query {
		allPets: [Pet!]!
		getPet(index: Int!): Pet
		firstPet: Pet
		lastPet: Pet
		getTime: Time
		getRandom(range: Int!): Int
		getRoll(sides: Int!, rolls: Int!): Dice
		getCount: Int!
		petsInRange(start: Int!, count: Int!): [Pet!]!
		getPetBySpecies(species: String!): [Pet!]!
		allSpecies: [nameOfSpecies!]!
	}

`);

const petList = [
  { name: "Shadow", species: "Dog", age: 7 },
  { name: "Fluffy", species: "Dog", age: 3 },
  { name: "Sassy", species: "Cat", age: 4 },
  { name: "Goldberg", species: "Frog", age: 1 },
];

//Define a resolver
const root = {
  allPets: () => {
    return petList;
  },

  getPet: ({ index }) => {
    return petList[index];
  },

  firstPet: () => {
    return petList[0];
  },

  lastPet: () => {
    const last = petList.length - 1;
    return petList[last];
  },

  getTime: () => {
    return {
      hour: new Date().getHours().toString() - 12,
      minute: new Date().getMinutes().toString(),
      seconds: new Date().getSeconds().toString(),
    };
  },

  getRandom: ({ range }) => {
    return Math.floor(Math.random() * range);
  },

  getRoll: ({ sides, rolls }) => {
    let totalCount = 0;
    let diceRoll = [];
    for (let i = 0; i < rolls; i += 1) {
      number = Math.floor(Math.random() * sides);
      diceRoll.push(number);
      totalCount += number;
    }
    return {
      total: totalCount,
      sides: sides,
      roll: diceRoll,
    };
  },

  getCount: () => {
	  return petList.length
  },

  petsInRange: ({ start, count }) => {
	  let totalPets = [];

	  for(i = 0; i <= count; i += 1){
		 totalPets.push(petList[i])
	  }
	  return totalPets
  },

  getPetBySpecies: ({ species }) => {
	return petList.filter(item => item.species === species)

  },

  allSpecies: () => {
	const getSpecies = petList.map(item => item.species);
	const iterator = getSpecies.values()
	for(const value of iterator){
		return [{name: value}]
	}
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
