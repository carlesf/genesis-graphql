 // Welcome to Launchpad!
// Log in to edit and save pads, and run queries in GraphiQL on the right.


import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

// Construct a schema the usual way, using GraphQL schema language
// This already contains all the information we need to create mocks
// of the correct types for any query.
const typeDefs = `
  type GeographicalCoordinate {
		latitude: String!
		longitude: String!
		infrastructure: Infrastructure!
	}

	type District {
		name: String!
		number: Int!
		suburbs: [Suburb] 
	}

	type Suburb {
		name: String! 
		district: District!
		metroAndBusInfrastructures: [MetroAndBusInfrastructure]  
	}

	interface Infrastructure {  
		coordinate: GeographicalCoordinate!
		nearbyInfrastructures: [Infrastructure]
		infrType: String!
	}

	type MetroAndBusInfrastructure implements Infrastructure {  
		coordinate: GeographicalCoordinate!
		nearbyInfrastructures: [Infrastructure]
		infrType: String!
		name: String!
		phone: String
		address: String
		suburb: Suburb
	}

	type BicingStation implements Infrastructure {  
		coordinate: GeographicalCoordinate!
		nearbyInfrastructures: [Infrastructure]
		infrType: String!
		id: Int!
		type: String!
		streetName: String!
		streetNumber: Int!
		altitude: Int!
		slots: Int!
		bikes: Int!
		status:String!
		nearbyStations (atLeastAvailableBikes:Int): [BicingStation]
	}

type Query {
    getInfrastructuresNearLocation (lat: String!, long: String!, rad: Int!): [Infrastructure]
		getDisctrictByName (dis: String!): District
		getBicingStationById (id: Int!): BicingStation
		getGeographicalCoordinateByLatAndLong (lat: String!, long: String!): GeographicalCoordinate
		getSuburbByName (sub: String!): Suburb
  }
`;

export const schema = makeExecutableSchema({ typeDefs });

const mocks = {
  // Here you could customize the mocks. 
  // If you leave it empty, the default is used.
  // You can read more about mocking here: http://bit.ly/2pOYqXF
  
};

// This function call adds the mocks to your schema!
addMockFunctionsToSchema({ schema, mocks });

