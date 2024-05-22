// src/App.tsx
import React from 'react';
import UserForm from './components/UserForm';
import UserDetails from './components/UserDetails';
import UserList from './components/UserList';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>User Dashboard</h1>
      <UserForm />
      {/* <UserList /> */}
      {/* <UserDetails /> */}
    </div>
  );
}

export default App;
