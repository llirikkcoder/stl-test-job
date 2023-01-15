import React, { useEffect, useState } from 'react';
import AutosuggestField from './Autosuggest';
import { countries } from '../data/countries';
import styled from 'styled-components';

const ToastMessageStyle = styled.div`
position: fixed;
bottom: 20px;
right: 20px;
padding: 10px;
background-color: rgb(85, 239, 9);
color: #fff;
border-radius: 5px;
font-size: 14px;
visibility: hidden;
opacity: 0;
transition: visibility 0s, opacity 0.5s linear;

&.show {
  visibility: visible;
  opacity: 1;
  transition-delay: 0s;
}
`;

function ToastMessage({ message }) {
  const [error, setError] = useState(null);

  if (error) {
    throw error;
  }

  return <ToastMessageStyle>{message}</ToastMessageStyle>;
}

function UsersTableRow({ user, users, setUsers, editingUser, setEditingUser, handleEditUserChange, handleEditUser, handleDeleteUser, handleUpdateUsers, setToastMessage }) {

  const [suggestions, setSuggestions] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    age: "",
    country: ""
  });
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const re = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return re.test(String(email).toLowerCase());
  }

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch('http://localhost:3001/users');
      const users = await response.json();
      setUsers(users);
    }
    fetchUsers();
  }, [setUsers]);



  const handleSaveUser = (user) => {
    if (!validateEmail(user.email)) {
      setEmailError("Invalid email address");
      // setToastMessage(<ToastMessage message={emailError} />)
    } else {
      // setEmailError("");
      setEmailError(null);

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
    }
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
          <>
            <input
              name="email"
              type="email"
              value={editingUser?.email}
              onChange={handleEditUserChange}
            />
            {emailError ? <span style={{ color: "red" }}>{emailError}</span> : null}
          </>
        ) : (
          user.email
        )}
      </td>
      <td>
        {editingUser?.id === user.id ? (
          <input
            name="age"
            type="number"
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
          />
          // <></>
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


