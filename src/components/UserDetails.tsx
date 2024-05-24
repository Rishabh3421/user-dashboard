import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserIcon from "./UserIcon"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


interface User {
  _id: string;
  name: string;
  dob: string;
  contact: string;
  email: string;
  description: string;
}

const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}`);
        const userData: User = response.data;
        // Convert the date of birth to a local date string
        userData.dob = new Date(userData.dob).toLocaleDateString();
        setUser(userData);
        setFormData(userData);
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error('Error fetching user details. Please try again.');
      }
    };
    fetchUser();
  }, [userId]);

  const handleDeleteClick = async () => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await axios.delete(`/api/users/${userId}`);
              toast.success('User deleted successfully');
              navigate('/');
            } catch (error) {
              console.error('Error deleting user:', error);
              toast.error('Error deleting user. Please try again.');
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCloseClick = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState!, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${userId}`, formData);
      setUser(formData);
      setIsEditing(false);
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user. Please try again.');
    }
  };

  const handleGoBack = () => {
    navigate('/'); 
  };

  if (!user || !formData) {
    return <div className="Loader">Loading...</div>;
  }

  return (
    <div className="Main">
      <button type="button" className="userListPageRedirect" onClick={handleGoBack}>Go to User List</button>
      <div className="userDetails">
        {isEditing ? (
        <div className="Form">
            <form className="updateForm" onSubmit={handleFormSubmit}>
            <label>
              Name:
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
            </label>
            <label>
              Date of Birth:
              <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
            </label>
            <label>
              Contact:
              <input type="text" name="contact" value={formData.contact} onChange={handleInputChange} />
            </label>
            <label>
              Email:
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            </label>
            <label>
              Description:
              <textarea name="description" value={formData.description} onChange={handleInputChange}></textarea>
            </label>
            <div className="buttonGroup">
              <button type="button" onClick={handleCloseClick}>Close</button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
        ) : (
          <div className="userCardDetail">
        <h1>User Details</h1>

            <div className="cardDesign">
            </div>
            <p><span>Name:</span> {user.name}</p>
            <p><span>Date of Birth:</span> {user.dob}</p>
            <p><span>Contact:</span> {user.contact}</p>
            <p><span>Email:</span> {user.email}</p>
            <p><span>Description:</span> {user.description}</p>
            <button className="editBtn" onClick={handleEditClick}>Edit</button>
            <button className="deleteBtn" onClick={handleDeleteClick}>Delete</button>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default UserDetails;
