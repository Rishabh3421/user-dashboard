import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../Styles.css';

// Custom CSS styles for toast notifications
const toastContainerStyle = {
  width: '20%',
  padding: '26px',
  borderRadius: '8px',
};

const toastStyle = {
  fontSize: '16px',
};

const UserForm: React.FC = () => {
  const initialFormData = {
    name: '',
    dob: '',
    contact: '',
    email: '',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate(); // Get the navigate function from React Router

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/users', formData);
      console.log('User created:', response.data);
      toast.success('User created successfully', { style: toastStyle });
      setFormData(initialFormData);
      setTimeout(() => {
        navigate('/'); 
      }, 3000); 
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error creating user. Please try again.', { style: toastStyle }); 
    }
  };
  

  return (
    <div className="main">
      <ToastContainer
        style={toastContainerStyle}
        bodyClassName="toast-body"
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
      />
      <form onSubmit={handleSubmit}>
        <h1 className="user">User Form</h1>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Contact:</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact Number"
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            style={{ resize: 'none' }}
          />
        </div>
        <button className='btn1' type="submit">Create User</button>
      </form>
    </div>
  );
};

export default UserForm;
