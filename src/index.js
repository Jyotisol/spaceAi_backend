const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  },
  plugins: [
    {
      async requestDidStart() {
        return {
          async willSendResponse({ response }) {
            console.log('GraphQL Response:', JSON.stringify({
              data: response.data,
              errors: response.errors,
              httpStatus: response.http?.status,
            }, null, 2));
          },
        };
      },
    },
  ],
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});