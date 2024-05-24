import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { confirmAlert } from 'react-confirm-alert';
import "../Styles.css";
import UserLogo from './UserIcon'; 

interface User {
  _id: string;
  name: string;
  dob: string;
  contact: string;
  email: string;
  description: string;
}

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <nav>
      <ul className='paginationBtn'>
        <li>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>{'<'}</button>
        </li>
        {Array.from({ length: totalPages }).map((_, index) => (
          <li key={index}>
            <button onClick={() => handlePageChange(index + 1)}>{index + 1 === currentPage ? currentPage : index + 1}</button>
          </li>
        ))}
        <li>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>{'>'}</button>
        </li>
      </ul>
    </nav>
  );
};

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const navigate = useNavigate();

  const navigateToUserForm = () => {
    navigate('/user-form');
  };

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

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user. Please try again.');
    }
  };

  const confirmDelete = (userId: string) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteUser(userId)
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  return (
    <div className='userContainer'>
      <div className="inputContainer">
        <input
          className='userSearchInput'
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button onClick={navigateToUserForm}>Create User</button>
      </div>
      {currentUsers.length > 0 ? (
        <ul className='cardContainer'>
          {currentUsers.map(user => (
            <li className='userCards' key={user._id}>
              <div className="cardContent" onClick={() => navigate(`/user/${user._id}`)}>
                {/* Display User Logo */}
                <UserLogo name={user.name} />
                <div><span>Name:</span> {user.name}</div>
                {/* <div>Contact: {user.contact}</div> */}
                <div><span>Email:</span> {user.email}</div>
                <div>{user.description}</div>
              </div>
              <div className="cardButtons">
                <button className='DeleteBtn' onClick={() => confirmDelete(user._id)}>Delete</button>
                {/* <Link to={`/user/${user._id}`} className='userDetailsLink'>Update</Link> */}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No users found.</div>
      )}
      {filteredUsers.length > usersPerPage && (
        <Pagination
          totalItems={filteredUsers.length}
          itemsPerPage={usersPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default UserList;
