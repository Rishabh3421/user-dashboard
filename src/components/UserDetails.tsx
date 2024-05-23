import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        setUser(userData);
        setFormData(userData);
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error('Error fetching user details. Please try again.');
      }
    };
    fetchUser();
  }, [userId]);

  const handleEditClick = () => {
    setIsEditing(true);
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

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`/api/users/${userId}`);
      toast.success('User deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user. Please try again.');
    }
  };

  if (!user || !formData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Details</h1>
      {isEditing ? (
        <form onSubmit={handleFormSubmit}>
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
          <button type="submit">Save</button>
        </form>
      ) : (
        <div>
          <p>Name: {user.name}</p>
          <p>Date of Birth: {user.dob}</p>
          <p>Contact: {user.contact}</p>
          <p>Email: {user.email}</p>
          <p>Description: {user.description}</p>
          <button onClick={handleEditClick}>Edit</button>
          <button onClick={handleDeleteClick}>Delete</button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default UserDetails;
