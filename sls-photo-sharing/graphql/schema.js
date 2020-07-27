const { gql } = require('apollo-server-lambda');

// GQL schema
const typeDefs = gql`
  scalar DateTime
  # User
  type User {
    githubLogin: ID!
    name: String
    avatar: String
    postedPhotos: [Photo!]!
    inPhotos: [Photo!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  # Photo
  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory
    postedBy: User!
    taggedUsers: [User!]!
    created: DateTime!
  }

  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  input PostPhotoInput {
    name: String!
    category: PhotoCategory = PORTRAIT
    description: String
  }

  # Root
  type Query {
    me: User
    totalPhotos: Int!
    allPhotos(after: DateTime): [Photo!]!
    totalUsers: Int!
    allUsers: [User!]!
  }

  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
    githubAuth(code: String!): AuthPayload!
    addFakeUsers(count: Int = 1): [User!]!
    fakeUserAuth(githubLogin: ID!): AuthPayload!
  }
`;

module.exports = {
  typeDefs
};
