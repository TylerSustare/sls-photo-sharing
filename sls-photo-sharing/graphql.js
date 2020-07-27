const { ApolloServer, PubSub } = require('apollo-server-lambda');
const { MongoClient } = require('mongodb');
const { typeDefs } = require('./graphql/schema');
const { resolvers } = require('./graphql/resolvers');

const CONNECTION_STRING =
  'mongodb+srv://sustare_atlas_user:sustare_atlas_user@photoshare-ltebu.mongodb.net/photoshare?retryWrites=true&w=majority';
let db;

const buildGraphQlContext = async ({ context, event }) => {
  const pubsub = new PubSub();
  const githubToken = event.headers.Authorization || event.headers.authorization;
  const currentUser = await db.collection('users').findOne({ githubToken });
  return {
    headers: event.headers,
    functionName: context.functionName,
    currentUser,
    context,
    pubsub,
    event,
    db
  };
};

const runHandler = (event, context, handler) =>
  new Promise((resolve, reject) => {
    const callback = (error, body) => (error ? reject(error) : resolve(body));

    handler(event, context, callback);
  });

const run = async (event, context) => {
  // The following line is critical for performance reasons to allow re-use of database connections across
  // calls to this Lambda function and avoid closing the database connection.
  // The first call to this lambda function takes about 5 seconds to complete,
  // while subsequent, close calls will only take a few hundred milliseconds.
  context.callbackWaitsForEmptyEventLoop = false;

  // Create your connections here
  if (!db) {
    // console.log('db was undefined');
    const client = await MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true });
    db = client.db();
  } else {
    // console.log('db was defined');
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: buildGraphQlContext
  });
  const handler = server.createHandler({ cors: { credentials: true, origin: '*' } });
  const response = await runHandler(event, context, handler);

  // Destroy your connections here (or don't so they can be used between invocations)

  return response;
};

exports.graphqlHandler = run;
