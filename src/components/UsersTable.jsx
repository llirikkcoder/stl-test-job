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
  const [sortField, setSortField] = useState(null);

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
      setUsers([...users].reverse()); // reverse the current order
      return;
    }
    setSortField(field);
    const sortedUsers = [...users].sort((a, b) => {
      if (a[field] < b[field]) {
        return -1;
      }
      if (a[field] > b[field]) {
        return 1;
      }
      return 0;
    });
    setUsers(sortedUsers);
  };

  return (
    <Table>
      <table>
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
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>{user.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Table>
  );
}

export default UsersTable;