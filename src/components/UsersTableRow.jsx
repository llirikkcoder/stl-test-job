import React, { useEffect, useState } from 'react';
import AutosuggestField from './Autosuggest';
import { countries } from '../data/countries';

function UsersTableRow({ user, users, setUsers, editingUser, setEditingUser, handleEditUserChange, handleEditUser, handleDeleteUser, handleUpdateUsers }) {

  const [suggestions, setSuggestions] = useState([]);
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
  }, [setUsers]);

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
      handleUpdateUsers(updatedUsers);
    }
    setEditingUser(null);
    saveUser(user);
  };

  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : countries.filter(country =>
      country.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = suggestion => suggestion;

  const renderSuggestion = suggestion => (
    <div>
      {suggestion}
    </div>
  );

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const inputProps = {
    placeholder: 'Type a country',
    value: editingUser ? editingUser.country : newUser.country,
    onChange: (e, { newValue }) => {
      if (editingUser) {
        setEditingUser({ ...editingUser, country: newValue });
      } else {
        setNewUser({ ...newUser, country: newValue });
      }
    },
  };

  return (
    <tr>
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

          <AutosuggestField
            suggestions={suggestions}
            onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
            onSuggestionsClearRequested={handleSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
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
            <button onClick={() => handleSaveUser(editingUser)}>Save</button>
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
  )
}

export default UsersTableRow;
