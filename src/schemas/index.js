const { gql } = require('apollo-server');

const typeDefs = gql`
  type Event {
    id: ID!
    title: String!
    description: String!
    startTime: String!
    endTime: String!
    location: String!
    isRecurring: Boolean!
    recurrenceRule: String
  }

  type Query {
    events: [Event!]!
    event(id: ID!): Event
    eventsByDateRange(start: String, end: String): [Event!]!
  }

  type Mutation {
    addEvent(
      title: String!
      description: String!
      startTime: String!
      endTime: String!
      location: String!
      isRecurring: Boolean!
      recurrenceRule: String
    ): Event!
    updateEvent(
      id: ID!
      title: String
      description: String
      startTime: String
      endTime: String
      location: String
      isRecurring: Boolean
      recurrenceRule: String
    ): Event!
    deleteEvent(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;