import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { countries } from '../data/countries';
import Autosuggest from './Autosuggest';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #282c34;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;

  th,
  td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  .react-autosuggest__container {
  position: relative;
}

.react-autosuggest__input {
  width: 240px;
  height: 30px;
  padding: 10px 20px;
  font-family: Helvetica, sans-serif;
  font-weight: 300;
  font-size: 16px;
  border: 1px solid #aaa;
  border-radius: 4px;
  background-color: #282c34;
  color: white;
}

.react-autosuggest__input--focused {
  outline: none;
}

.react-autosuggest__input--open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.react-autosuggest__suggestions-container--open {
  display: block;
  position: absolute;
  top: 51px;
  width: 280px;
  border: 1px solid #aaa;
  background-color: #282c34;
  font-family: Helvetica, sans-serif;
  font-weight: 300;
  font-size: 16px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  z-index: 2;
  cursor: pointer;
}
`;

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
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
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    let sortedUsers = [...users]
    if (field === 'age') {
      sortedUsers = sortOrder === "asc" ? sortedUsers.sort((a, b) => a[field] - b[field]) : sortedUsers.sort((a, b) => b[field] - a[field])
    } else {
      sortedUsers = sortOrder === "asc" ?
        sortedUsers.sort((a, b) => {
          if (a[field].toLowerCase() < b[field].toLowerCase()) {
            return -1;
          }
          if (a[field].toLowerCase() > b[field].toLowerCase()) {
            return 1;
          }
          return 0;
        })
        :
        sortedUsers.sort((a, b) => {
          if (b[field].toLowerCase() < a[field].toLowerCase()) {
            return -1;
          }
          if (b[field].toLowerCase() > a[field].toLowerCase()) {
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

  const handleSelectCountry = (country) => {
    setEditingUser({
      ...editingUser,
      country
    });
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:3001/users/${editingUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editingUser)
    });
    const updatedUser = await response.json();
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setEditingUser(null);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`http://localhost:3001/users/${id}`, {
      method: "DELETE"
    });
    setUsers(users.filter(user => user.id !== id));
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
        response = await fetch(`http://localhost:3001/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user)
        });
      } else {
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
    setEditingUser(null);
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

  const handleCountrySelect = (country) => {
    setEditingUser({
      ...editingUser,
      country
    });
  }

  const handleEditUserSelect = (country) => {
    setEditingUser({
      ...editingUser,
      country: country
    });
  }

  const renderCell = (field, user) => {
    if (field === 'country' && editingUser?.id === user.id) {
      return (
        <td>
          <Autosuggest
            items={countries}
            value={editingUser?.country}
            onChange={handleEditUserChange}
            onSelect={handleCountrySelect}
          />
        </td>
      )
    }
    return <td>{user[field]}</td>
  }

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
          <th>
            <button>Actions</button>
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
                <Autosuggest
                  items={countries}
                  name="country"
                  value={editingUser?.country}
                  onChange={handleEditUserChange}
                  onSelect={handleEditUserSelect}
                // onChange={(e) => handleEditUserChange(e)}
                // onSelect={(suggestion) => handleEditUserSelect(suggestion)}
                />
              ) : (
                user.country
              )}
            </td>
            {/* <renderCell /> */}
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
    </Table>
  );
}

export default UsersTable;
