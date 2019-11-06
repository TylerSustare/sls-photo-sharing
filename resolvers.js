const { GraphQLScalarType } = require('graphql');

const resolvers = {
    Query: {
        totalPhotos: () => photos.length,
        allPhotos: () => photos
    },

    Mutation: {
        postPhoto(parent, args) {
            const newPhoto = {
                id: _id++,
                ...args.input,
                created: new Date(),
            };
            photos.push(newPhoto);
            return newPhoto;
        },
    },

    Photo: {
        url: parent => `http://yoursite.com/img/${parent.id}.jpg`,
        postedBy: parent => users.find(u => u.githubLogin === parent.githubUser),
        taggedUsers: parent => tags
            // return an array of tags that only contain the current photo
            .filter(tag => tag.photoID === parent.id)
            // convert array of tags into an array of userIDs
            .map(tag => tag.userID)
            // convert array of userIDs into array of user objects
            .map(userID => users.find(u => u.githubLogin === userID))
    },

    User: {
        postedPhotos: parent => photos.filter(p => p.githubUser === parent.githubLogin),
        inPhotos: parent => {
            console.log('boop');
            return tags
                // return array of tags that only contains current users
                .filter(tag => tag.userID === parent.id)
                // convert array of tags into an array of photoIDs
                .map(tag => tag.photoID)
                // convert array of photoIDs into an array of photo objects
                .map(photoID => photos.find(p => p.id === photoID));
        },
    },

    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'A valid date time value',
        parseValue: value => new Date(value),
        serialize: value => new Date(value).toISOString(),
        parseLiteral: ast => ast.value,
    }),
};

// Some data
let users = [
    { githubLogin: 'mHattrup', name: 'Mike Hattrup' },
    { githubLogin: 'gPlake', name: 'Glen Plake' },
    { githubLogin: 'sSchmidt', name: 'Scot Schmidt' }
];

let photos = [
    {
        id: '1',
        name: 'Dropping the Heart Chute',
        description: 'The heart chute is one of my favorite chutes',
        category: 'ACTION',
        githubUser: 'gPlake',
        created: '3-28-1977',
    },
    {
        id: '2',
        name: 'Enjoying the sunshine',
        category: 'SELFIE',
        githubUser: 'sSchmidt',
        created: '3-28-1985',
    },
    {
        id: '3',
        name: 'Gunbarrel 25',
        description: '25 laps on gunbarrel today',
        category: 'LANDSCAPE',
        githubUser: 'sSchmidt',
        created: '2018-04-15T19:09:57.308Z',
    }
];

// relationship mapping
const tags = [
    { photoID: '1', userID: 'gPlake' },
    { photoID: '2', userID: 'sSchmidt' },
    { photoID: '2', userID: 'mHattrup' },
    { photoID: '2', userID: 'gPlake' }
];

let _id = 0;

module.exports = {
    resolvers,
};
