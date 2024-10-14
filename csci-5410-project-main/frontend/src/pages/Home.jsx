import React, { useEffect, useState } from "react";
import RoomGrid from "../components/RoomGrid";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

const HomePage = () => {
  const [isAdmin, setIsAdmin] = useState(false); // State to manage admin status
  const storedUser = localStorage.getItem("user");

  useEffect(() => {
    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log("User found in localStorage on HomePage:", user);

      // Fetch the list of admins from the API
      axios.post('https://9d73job9uc.execute-api.us-east-1.amazonaws.com/dev/get-admin')
        .then(response => {
          const admins = JSON.parse(response.data.body).admins;
          console.log("Fetched admins list:", admins);

          // Check if the user's email is in the list of admins
          const isUserAdmin = admins.some(admin => admin.UserID === user.email);
          setIsAdmin(isUserAdmin);

          // Log if the user is an admin or not
          if (isUserAdmin) {
            console.log(`User ${user.email} is an admin.`);
          } else {
            console.log(`User ${user.email} is not an admin.`);
          }
        })
        .catch(error => {
          console.error("Error fetching admin list:", error);
        });
    } else {
      console.log("No user found in localStorage");
    }
  }, [storedUser]); // Run effect when storedUser changes

  return (
    <div className="container">
      <h1 className="my-4">Available Rooms!</h1>
      <RoomGrid />
      {isAdmin && (
        <Link to="/add-room" className="btn btn-success mb-4">
          Add New Room
        </Link>
      )}
    </div>
  );
};

export default HomePage;
