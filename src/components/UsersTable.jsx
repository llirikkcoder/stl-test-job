import { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, sortUsers } from '../store/usersSlice';
// import { fetchUsers, sortUsers, updateUser, deleteUser, createUser } from './usersSlice';

const Table = styled.table`
width: 100%;
border-collapse: collapse;

th,
td {
padding: 8px;
text-align: left;
border-bottom: 1px solid #ddd;
}
`;

function UsersTable() {
  const users = useSelector((state) => state.users.items);
  const sortField = useSelector((state) => state.users.sortField);
  // const editingUser = useSelector((state) => state.users.editingUser);
  // const newUser = useSelector((state) => state.users.newUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSort = (field) => {
    dispatch(sortUsers(field));
  };

  // const handleNewUserChange = (e) => {
  //   const { name, value } = e.target;
  //   dispatch(updateUser({
  //     ...newUser,
  //     [name]: value
  //   }));
  // };

  // const handleEditUserChange = (e) => {
  //   const { name, value } = e.target;
  //   dispatch(updateUser({
  //     ...editingUser,
  //     [name]: value
  //   }));
  // };

  // const handleEditUser = (user) => {
  //   dispatch(updateUser(user));
  // };

  // const handleDeleteUser = (user) => {
  //   dispatch(deleteUser(user));
  // };

  // const handleSaveUser = (user) => {
  //   dispatch(createUser(user));
  // };

  // const handleCancelEdit = () => {
  //   dispatch(updateUser(null));
  // };

  // const handleCreateUser = () => {
  //   handleSaveUser(newUser);
  //   dispatch(updateUser({
  //     username: "",
  //     email: "",
  //     age: null,
  //     country: ""
  //   }));
  // };

  return (
    <Table>
      {/* <table> */}
      <thead>
        <tr>
          <th>
            <button onClick={() => handleSort('username')}>Username</button>
          </th>
          <th>
            <button onClick={() => handleSort('email')}>Email</button>
          </th>
          <th>
            <button onClick={() => handleSort('age')}>Age</button>
          </th>
          <th>
            <button onClick={() => handleSort('country')}>Country</button>
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              {/* {editingUser?.id === user.id ? (
                <input
                  name="username"
                  value={editingUser?.username}
                  onChange={handleEditUserChange}
                />
              ) : ( */}
              {user.username}
              {/* )} */}
            </td>
            <td>
              {/* {editingUser?.id === user.id ? (
                <input
                  name="email"
                  value={editingUser?.email}
                  onChange={handleEditUserChange}
                />
              ) : ( */}
              {user.email}
              {/* )} */}
            </td>
            <td>
              {/* {editingUser?.id === user.id ? (
                <input
                  name="age"
                  value={editingUser?.age}
                  onChange={handleEditUserChange}
                />
              ) : ( */}
              {user.age}
              {/* )} */}
            </td>
            <td>
              {/* {editingUser?.id === user.id ? (
                <input
                  name="country"
                  value={editingUser?.country}
                  onChange={handleEditUserChange}
                />
              ) : ( */}
              {user.country}
              {/* )} */}
            </td>
            <td>
              {/* {editingUser?.id === user.id ? (
                <>
                  <button onClick={() => handleSaveUser(editingUser)}>
                    Save
                  </button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEditUser(user)}>Edit</button>
                  <button onClick={() => handleDeleteUser(user)}>Delete</button>
                </>
              )} */}
            </td>
          </tr>
        ))}
      </tbody>
      {/* <tfoot>
        <tr>
          <td>
            <input
              name="username"
              value={newUser?.username}
              onChange={handleNewUserChange}
            />
          </td>
          <td>
            <input
              name="email"
              value={newUser?.email}
              onChange={handleNewUserChange}
            />
          </td>
          <td>
            <input
              name="age"
              value={newUser?.age}
              onChange={handleNewUserChange}
            />
          </td>
          <td>
            <input
              name="country"
              value={newUser?.country}
              onChange={handleNewUserChange}
            />
          </td>
          <td>
            <button onClick={handleCreateUser}>Create</button>
          </td>
        </tr>
      </tfoot> */}
      {/* </table> */}
    </Table>
  );
}

export default UsersTable;
