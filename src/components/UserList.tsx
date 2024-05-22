import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  dob: string;
  contact: string;
  email: string;
  description: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Number of users per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Filter users
  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when search term changes
  }, [searchTerm, users]);

  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <ul>
        {currentUsers.map(user => (
          <li key={user._id}>
            <div>Name: {user.name}</div>
            <div>Date of Birth: {formatDate(user.dob)}</div>
            <div>Contact: {user.contact}</div>
            <div>Email: {user.email}</div>
            <div>Description: {user.description}</div>
          </li>
        ))}
      </ul>
      {/* Pagination */}
      <nav>
        <ul>
          {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, index) => (
            <li key={index}>
              <button onClick={() => paginate(index + 1)}>{index + 1}</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default UserList;
