import React, { useState } from 'react';
import axios from 'axios';

interface UserFormData {
  name: string;
  dob: string;
  contact: string;
  email: string;
  description: string;
}

const UserForm: React.FC = () => {
  const initialFormData: UserFormData = {
    name: '',
    dob: '',
    contact: '',
    email: '',
    description: ''
  };

  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost/3001/api/users', formData);
      console.log('User created:', response.data);
      setFormData(initialFormData); // Reset form after successful submission
      setError(''); // Clear any previous error
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Error creating user. Please try again.'); // Set error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Date of Birth:</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
      </div>
      <div>
        <label>Contact:</label>
        <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message */}
      <button type="submit">Create User</button>
    </form>
  );
};

export default UserForm;
