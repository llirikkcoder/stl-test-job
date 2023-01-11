import { useEffect, useState } from 'react';
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

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    age: "",
    country: ""
  });

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch('http://localhost:3001/users');
      const users = await response.json();
      setUsers(users);
    }
    fetchUsers();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setUsers([...users].reverse());
      return;
    }
    setSortField(field);
    let sortedUsers = [...users]
    if (field === 'age') {
      sortedUsers = sortedUsers.sort((a, b) => a[field] - b[field])
    } else {
      sortedUsers = sortedUsers.sort((a, b) => {
        if (a[field].toLowerCase() < b[field].toLowerCase()) {
          return -1;
        }
        if (a[field].toLowerCase() > b[field].toLowerCase()) {
          return 1;
        }
        return 0;
      });
    }
    setUsers(sortedUsers);
  };

  const handleNewUserChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  const handleEditUserChange = (e) => {
    setEditingUser({
      ...editingUser,
      [e.target.name]: e.target.value
    });
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleDeleteUser = (user) => {
    async function deleteUser(user) {
      await fetch(`http://localhost:3001/users/${user.id}`, {
        method: "DELETE"
      });
      const updatedUsers = users.filter((u) => u.id !== user.id);
      setUsers(updatedUsers);
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
      setUsers(updatedUsers);
    }
    saveUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleCreateUser = () => {
    handleSaveUser(newUser);
    setNewUser({
      username: "",
      email: "",
      age: null,
      country: ""
    });
  };

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
              {editingUser?.id === user.id ? (
                <input
                  name="username"
                  value={editingUser?.username}
                  onChange={handleEditUserChange}
                />
              ) : (
                user.username
              )}
            </td>
            <td>
              {editingUser?.id === user.id ? (
                <input
                  name="email"
                  value={editingUser?.email}
                  onChange={handleEditUserChange}
                />
              ) : (
                user.email
              )}
            </td>
            <td>
              {editingUser?.id === user.id ? (
                <input
                  name="age"
                  value={editingUser?.age}
                  onChange={handleEditUserChange}
                />
              ) : (
                user.age
              )}
            </td>
            <td>
              {editingUser?.id === user.id ? (
                <input
                  name="country"
                  value={editingUser?.country}
                  onChange={handleEditUserChange}
                />
              ) : (
                user.country
              )}
            </td>
            <td>
              {editingUser?.id === user.id ? (
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
              )}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
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
      </tfoot>
      {/* </table> */}
    </Table>
  );
}

export default UsersTable;
