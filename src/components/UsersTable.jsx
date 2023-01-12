import { useEffect, useState } from 'react';
import styled from 'styled-components';

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
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch('http://localhost:3001/users');
      const users = await response.json();
      setUsers(users);
    }
    fetchUsers();
  }, []);

  const handleSort = (field) => {
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

  const handleEditUserChange = (e) => {
    setEditingUser({
      ...editingUser,
      [e.target.name]: e.target.value
    });
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleSaveUser = (user) => {
    async function saveUser(user) {
      let response;

      response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      const savedUser = await response.json();
      const updatedUsers = user.id
        ? users.map((u) => (u.id === savedUser.id ? savedUser : u))
        : [...users, savedUser];
      setUsers(updatedUsers);
    }
    saveUser(user);
    setEditingUser(null);
  };

  return (
    <Table>
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
                </>
              ) : (
                <>
                  <button onClick={() => handleEditUser(user)}>Edit</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default UsersTable;
