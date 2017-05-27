import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';

import { schema, rootValue, context } from './schema';

const PORT = 8080;
const server = express();



server.use('/graphql', bodyParser.json(), graphqlExpress(request => ({
  schema,
  rootValue,
  context: context(request.headers, process.env),
})));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  query: `# API1: InfrastructuresNearLocation
query InfrastructuresNearLocation($lat: String!, $long: String!, $rad: Int!) {
	getInfrastructuresNearLocation (lat: $lat, long: $long, rad: $rad) {
		... nearByFields		
	}
}
  
fragment nearByFields on Infrastructure {
  coordinate {
    latitude
		longitude
  }
	infrType
	... on MetroAndBusInfrastructure  {
		name
	}
	... on BicingStation  {
		bikes
	}
}

# API2: AvailableBikesNearBicingStation
query AvailableBikesNearBicingStation ($id: Int!) {
	getBicingStationById (id: $id) {
		nearbyStations (atLeastAvailableBikes:1) {
			coordinate {
    		latitude
				longitude
  		}
      id
			streetName
			streetNumber
			altitude
			slots
			bikes
			status	
		}
	}
}

# API3: InfrastructureNearInfrastructure
query InfrastructureNearInfrastructure ($lat: String!, $long: String!) {
getGeographicalCoordinateByLatAndLong (lat: $lat, long: $long) {
	infrastructure  {
		nearbyInfrastructures  {
			 ... nearByFields
		}
	}
}
}

# API4: MetroAndBusStationsInSuburb
query MetroAndBusStationsInSuburb ($sub: String!) {
	getSuburbByName (sub: $sub) {
		metroAndBusInfrastructures {
			name
			phone
			address
		}
	}
}

# API5: MetroAndBusStationsInDistrict
query MetroAndBusStationsInDistrict ($dis: String!) {
	getDisctrictByName (dis: $dis) {
		suburbs {
			metroAndBusInfrastructures {
				name
				phone
				address
				suburb {
					name
				}
			}
		}
	}
}
`,
}));

server.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}/graphql`);
  console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`);
});