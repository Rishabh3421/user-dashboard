import { useEffect, useState } from "react";
import axios from "axios";

// Define the interface representing the shape of your user data
interface User {
  id: number;
  name: string;
  dob: string; // Changed type to string
  contact: string;
  email: string;
  description: string;
}

const App = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get("/api/users")
      .then((res) => {
        const formattedUsers = res.data.map((user: User) => ({
          ...user,
          dob: new Date(user.dob).toLocaleDateString(), // Format dob without timezone
        }));
        setUsers(formattedUsers);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  return (
    <>
      <h1>Users List</h1>
      <p>Users: {users.length}</p>
      {users.map((user, index) => (
        <div key={index}> 
          <h2>{user.name}</h2>
          <p>Date of Birth: {user.dob}</p>
          <p>Contact: {user.contact}</p>
          <p>Email: {user.email}</p>
          <p>Description: {user.description}</p>
        </div>
      ))}
    </>
  );
}

export default App;
