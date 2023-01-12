import { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import uuid from 'react-uuid';

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

const initialState = {
  users: [],
  sortField: null,
  editingUser: null,
  newUser: {
    username: "",
    email: "",
    age: "",
    country: ""
  }
}

const usersReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_USERS":
      return { ...state, users: action.payload }
    case "SORT_USERS":
      let sortField = action.payload
      let sortedUsers = [...state.users];

      if (state.sortField === sortField) {
        sortedUsers.reverse();
      } else if (sortField === 'age') {
        sortedUsers = sortedUsers.sort((a, b) => a[sortField] - b[sortField]);
      } else {
        sortedUsers = sortedUsers.sort((a, b) => {
          if (a[sortField].toLowerCase() < b[sortField].toLowerCase()) {
            return -1;
          }
          if (a[sortField].toLowerCase() > b[sortField].toLowerCase()) {
            return 1;
          }
          return 0;
        });
      }
      return { ...state, users: sortedUsers, sortField: action.payload };

    case "EDIT_USER":
      return { ...state, editingUser: action.payload }
    case "DELETE_USER":
      // delete user logic
      return { ...state, users: action.payload }
    case "SAVE_USER":
      // save user logic
      return { ...state, users: action.payload }
    case "CANCEL_EDIT":
      return { ...state, editingUser: null }
    case "CREATE_USER":
      // create user logic
      return { ...state, newUser: { username: "", email: "", age: null, country: "" } }
    case "HANDLE_NEW_USER_CHANGE":
      return { ...state, newUser: action.payload }
    case "HANDLE_EDIT_USER_CHANGE":
      return { ...state, editingUser: action.payload }
    default:
      return state;
  }
}

function UsersTable() {
  const [state, dispatch] = useReducer(usersReducer, initialState);
  const { users, sortField, editingUser, newUser } = state;
  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch('http://localhost:3001/users');
      const users = await response.json();
      dispatch({ type: "FETCH_USERS", payload: users });
    }
    fetchUsers();
  }, []);

  const handleSort = (field) => {
    dispatch({ type: "SORT_USERS", payload: field });
  };

  const handleNewUserChange = (e) => {
    const newUser = { ...state.newUser, [e.target.name]: e.target.value };
    dispatch({ type: "HANDLE_NEW_USER_CHANGE", payload: newUser });
  };

  const handleEditUserChange = (e) => {
    const editingUser = { ...state.editingUser, [e.target.name]: e.target.value };
    dispatch({ type: "HANDLE_EDIT_USER_CHANGE", payload: editingUser });
  };

  const handleEditUser = (user) => {
    dispatch({ type: "EDIT_USER", payload: user });
  };

  const handleDeleteUser = (user) => {
    async function deleteUser(user) {
      await fetch(`http://localhost:3001/users/${user.id}`, {
        method: "DELETE"
      });
      const updatedUsers = users.filter((u) => u.id !== user.id);
      dispatch({ type: "DELETE_USER", payload: updatedUsers });
    }
    deleteUser(user);
  };

  const handleSaveUser = (user) => {
    async function saveUser(user) {
      let response;
      if (user.id) {
        // update existing user
        response = await fetch(`http://localhost:3001/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user)
        });
      } else {
        // create new user
        response = await fetch("http://localhost:3001/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user)
        });
      }
      const savedUser = await response.json();
      const updatedUsers = user.id
        ? users.map((u) => (u.id === savedUser.id ? savedUser : u))
        : [...users, savedUser];
      dispatch({ type: "SAVE_USER", payload: updatedUsers });
    }
    saveUser(user);
  };

  const handleCancelEdit = () => {
    dispatch({ type: "CANCEL_EDIT" });
  };

  const handleCreateUser = () => {
    handleSaveUser(newUser);
    dispatch({ type: "CREATE_USER" });
  };

  return (
    <Table>
      <thead>
        <tr>
          <th onClick={() => handleSort('username')}>Username</th>
          <th onClick={() => handleSort('email')}>Email</th>
          <th onClick={() => handleSort('age')}>Age</th>
          <th onClick={() => handleSort('country')}>Country</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {state.users.map((user) => (
          <tr key={uuid()}>
            {editingUser && editingUser.id === user.id ? (
              <>
                <td>
                  <input
                    type="text"
                    name="username"
                    value={editingUser.username}
                    onChange={handleEditUserChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="email"
                    value={editingUser.email}
                    onChange={handleEditUserChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="age"
                    value={editingUser.age}
                    onChange={handleEditUserChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="country"
                    value={editingUser.country}
                    onChange={handleEditUserChange}
                  />
                </td>
                <td>
                  <button onClick={() => handleSaveUser(editingUser)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </td>
              </>
            ) : (
              <>
                <td>{user.username}</td>

                <td>{user.email}</td>
                <td>{user.age}</td>
                <td>{user.country}</td>
                <td>
                  <button onClick={() => handleEditUser(user)}>Edit</button>
                  <button onClick={() => handleDeleteUser(user)}>Delete</button>
                </td>
              </>
            )}
          </tr>
        ))}
        <tr>
          <td>
            <input
              type="text"
              name="username"
              value={state.newUser.username}
              onChange={handleNewUserChange}
            />
          </td>
          <td>
            <input
              type="text"
              name="email"
              value={state.newUser.email}
              onChange={handleNewUserChange}
            />
          </td>
          <td>
            <input
              type="number"
              name="age"
              value={state.newUser.age}
              onChange={handleNewUserChange}
            />
          </td>
          <td>
            <input
              type="text"
              name="country"
              value={state.newUser.country}
              onChange={handleNewUserChange}
            />
          </td>
          <td>
            <button onClick={handleCreateUser}>Create</button>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
export default UsersTable;