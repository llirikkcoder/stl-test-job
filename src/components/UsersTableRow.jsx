import React, { useEffect, useState } from 'react';
import AutosuggestField from './Autosuggest';

function UsersTableRow({ handleEditUserChange, handleEditUser, handleDeleteUser }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

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
          //   <AutosuggestField
          //     suggestions={suggestions}
          //     onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
          //     onSuggestionsClearRequested={handleSuggestionsClearRequested}
          //     getSuggestionValue={getSuggestionValue}
          //     renderSuggestion={renderSuggestion}
          //     inputProps={inputProps}
          //     value={editingUser?.country}
          //   />
          <></>
        ) : (
          user.country
        )}
      </td>
      <td>
        {editingUser?.id === user.id ? (
          <button onClick={() => handleSaveUser(editingUser)}>Save</button>
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
