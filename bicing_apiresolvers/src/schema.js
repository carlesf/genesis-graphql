 // Welcome to Launchpad!
// Log in to edit and save pads, and run queries in GraphiQL on the right.


import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';
import request from 'request';

const bicingBaseUrl = 'http://wservice.viabicing.cat/v2/stations';

// Construct a schema the usual way, using GraphQL schema language
// This already contains all the information we need to create mocks
// of the correct types for any query.
const typeDefs = `

	type GeographicalCoordinate {
		latitude: String!
		longitude: String!
	}

  type BicingStation {
		coordinate: GeographicalCoordinate!
		id: Int!
		type: String!
		streetName: String!
		streetNumber: Int!
		altitude: Int!
		slots: Int!
		bikes: Int!
		status:String!
		nearbyStations: [BicingStation]
	}

type Query {
		getAllBicingStations: [BicingStation]
    getBicingStationById (id: Int!): BicingStation
  }
`;

function filterInt(value) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
    return Number(value);
  return NaN;
}

function parseBicingStation(data) {
  const id = filterInt(data.id);
  const type = data.type;
  const streetName = data.streetName;
  const streetNumber = data.streetNumber;
  const altitude = data.altitude;
  const slots = data.slots;
  const bikes = data.bikes;
  const status = data.status;
  const _nearbyStationIds = data.nearbyStations.split(", ").map(filterInt);
  const _coords = [data.latitude, data.longitude]
  return ({
    		id,
        type,
        streetName,
        streetNumber,
        altitude,
        slots,
        bikes,
        status,
        _nearbyStationIds,
    		_coords
      });
}

function getBicingStations() {
  return new Promise((resolve, reject) => {
    request(bicingBaseUrl, (error, response, body) => {
      if (error) {
        reject(error);
      }
      const output = JSON.parse(body).stations.map(parseBicingStation)
      resolve(output);
    });
  });
}

function getBicingStation(id) {
  return new Promise((resolve, reject) => {
    request(`${bicingBaseUrl}/${id}`, (error, response, body) => {
      if (error) {
        reject(error);
      }
      const output = parseBicingStation(JSON.parse(body).stations[0]);
      resolve(output);
    });
  });
}

const resolvers = {
  Query: {
    getAllBicingStations: (_) => getBicingStations(),
    getBicingStationById: (_, args) => getBicingStation(args.id)
  },
  
  BicingStation: {
    nearbyStations: (root) => root._nearbyStationIds.map(getBicingStation),
    coordinate: (root) => ({latitude: root._coords[0], longitude: root._coords[1]})
  }
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});