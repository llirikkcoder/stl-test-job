import { useEffect, useState } from 'react';
import { countries } from '../data/countries';
import ToastMessage from './ToastMessage';
import Table from './Table';
import AutosuggestFieldNew from './AutosuggestNew';
import UsersTableRow from './UsersTableRow';

const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : countries.filter(country =>
    country.toLowerCase().slice(0, inputLength) === inputValue
  );
};

const getSuggestionValue = suggestion => suggestion;

const renderSuggestion = suggestion => (
  <div>
    {suggestion}
  </div>
);

function UsersTable() {

  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [suggestionsNew, setSuggestionsNew] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  const handleSuggestionsFetchRequestedNew = ({ value }) => {
    setSuggestionsNew(getSuggestions(value));
  };

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
    showToast(`${field} column sorted`)
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
        // редактировать существующего пользователя
        response = await fetch(`http://localhost:3001/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user)
        });
      } else {
        // создать нового пользователя
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

  const handleCreateUser = () => {
    handleSaveUser(newUser);
    setNewUser({
      username: "",
      email: "",
      age: null,
      country: ""
    });
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestionsNew([]);
  };

  const inputPropsNew = {
    placeholder: 'Type a country',
    value: newUser.country,
    onChange: (e, { newValue }) => {
      setNewUser({ ...newUser, country: newValue });
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const handleUpdateUsers = (updatedUsers) => {
    setUsers(updatedUsers);
  }

  return (
    <>
      <Table>
        <thead>
          <tr>
            {["username", "email", "age", "country"].map((item) => (
              <th>
                <button onClick={() => handleSort(item)}>{item.charAt(0).toUpperCase() + item.slice(1)}</button>
              </th>
            ))}
            <th>
              <button>Actions</button>
            </th>
          </tr>
        </thead>
        {users.map((user) => (
          <UsersTableRow
            key={user.id}
            user={user}
            setEditingUser={setEditingUser}
            editingUser={editingUser}
            handleEditUser={handleEditUser}
            handleEditUserChange={handleEditUserChange}
            handleDeleteUser={handleDeleteUser}
            handleSaveUser={handleSaveUser}
            handleUpdateUsers={handleUpdateUsers}
            users={users}
            setUsers={setUsers}
          />
        ))}
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
              <AutosuggestFieldNew
                suggestions={suggestionsNew}
                onSuggestionsFetchRequested={handleSuggestionsFetchRequestedNew}
                onSuggestionsClearRequested={handleSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputPropsNew}
              />
            </td>
            <td>
              <button onClick={handleCreateUser}>Create</button>
            </td>
          </tr>
        </tfoot>
      </Table>
      <ToastMessage className={`${toastMessage ? "show" : ""}`}>
        {toastMessage}
      </ToastMessage>
    </>
  );
}

export default UsersTable;
