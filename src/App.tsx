import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserList from './components/UserList';
import UserDetails from './components/UserDetails';
import UserForm from './components/UserForm';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="user/:userId" element={<UserDetails />} />
        <Route path="user-form" element={<UserForm />} />
      </Routes>
    </div>
  );
}

export default App;
