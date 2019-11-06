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
    category: PhotoCategory=PORTRAIT
    description: String
  }

  # Root
  type Query {
    totalPhotos: Int!
    allPhotos(after: DateTime): [Photo!]!
  }

  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
  }
`;

module.exports = {
    typeDefs,
};
