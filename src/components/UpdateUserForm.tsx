import React, { useState } from 'react';
import axios from 'axios';

interface UserFormData {
  name: string;
  dob: string;
  contact: string;
  email: string;
  description: string;
}

interface Props {
  userId: string;
  userData: UserFormData;
  onUpdateSuccess: () => void;
  onCancel: () => void;
}

const UpdateUserForm: React.FC<Props> = ({ userId, userData, onUpdateSuccess, onCancel }) => {
  const [formData, setFormData] = useState<UserFormData>(userData);
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
      const response = await axios.put(`/api/users/${userId}`, formData);
      console.log('User updated:', response.data);
      onUpdateSuccess();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Error updating user. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name:</label>
        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Date of Birth:</label>
        <input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Contact:</label>
        <input type="text" className="form-control" name="contact" value={formData.contact} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Description:</label>
        <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit" className="btn btn-primary">Save</button>
      <button type="button" className="btn btn-secondary ml-2" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default UpdateUserForm;
