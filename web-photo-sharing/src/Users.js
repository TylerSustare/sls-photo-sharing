import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { ROOT_QUERY } from './App';

const ADD_FAKE_USERS_MUTATION = gql`
  mutation addFakeUsers($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
      name
      avatar
    }
  }
`;

const Users = () => (
  <Query query={ROOT_QUERY}>
    {({ data, loading, refetch }) =>
      loading ? (
        <p>loading users...</p>
      ) : (
        <UserList count={data.totalUsers} users={data.allUsers} refetchUsers={refetch} />
      )
    }
  </Query>
);

// you sit on a throne of lies
const updateUserCache = (cache, { data: { addFakeUsers } }) => {
  let data = cache.readQuery({ query: ROOT_QUERY });
  data.totalUsers += addFakeUsers.length;
  data.allUsers = [...data.allUsers, ...addFakeUsers];
  cache.writeQuery({ query: ROOT_QUERY, data });
};

const UserList = ({ count, users, refetchUsers }) => (
  <div>
    <p>{count} Users</p>
    <button onClick={() => refetchUsers()}>Refetch Users</button>
    <Mutation
      mutation={ADD_FAKE_USERS_MUTATION}
      variables={{ count: 1 }}
      refetchQueries={[{ query: ROOT_QUERY }]} // we don't need to refetch this since we have it in the response of the mutation
      // update={updateUserCache} // but apparently the cache doesn't really work so we do have to 🙄
    >
      {addFakeUsers => (
        <>
          {/*!! you can send variables to mutations in one of two ways */}
          <button onClick={addFakeUsers}>Add Fake Users with variables in mutation query</button>
          <button onClick={() => addFakeUsers({ count: 1 })}>
            Add Fake Users with variables in function call
          </button>
        </>
      )}
    </Mutation>
    <ul>
      {users.map(user => (
        <UserListItem key={user.githubLogin} name={user.name} avatar={user.avatar} />
      ))}
    </ul>
  </div>
);
const UserListItem = ({ name, avatar }) => (
  <li>
    <img src={avatar} width={48} height={48} alt="" />
    {name}
  </li>
);
export default Users;
