import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import axios from "axios";

function NavbarComponent() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log("User found in localStorage on Navbar:", user);

      // Fetch the list of admins from the API
      axios
        .post(
          "https://bwp4u6shp1.execute-api.us-east-1.amazonaws.com/prod/fetch-admin-users"
        )
        .then((response) => {
          const admins = JSON.parse(response.data.body).admins;
          console.log("Fetched admins list:", admins);

          // Check if the user's email is in the list of admins
          const isUserAdmin = admins.some(
            (admin) => admin.UserID === user.email
          );
          setIsAdmin(isUserAdmin);
        })
        .catch((error) => {
          console.error("Error fetching admin list:", error);
        });
    } else {
      console.log("No user found in localStorage");
    }
  }, []);

  const user = localStorage.getItem("user");

  const handleLogout = () => {
    // Clear user session from local storage
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">Dal Vacation Home</Navbar.Brand>
        <Nav className="me-auto">
          {isAdmin && (
            <Link to="/statistics-dashboard">
              <Button variant="dark">Statistics</Button>
            </Link>
          )}

          {/* Conditional rendering based on admin status */}
          {isAdmin ? (
            <Link to="/agent-dashboard">
              <Button variant="dark">Agent Concerns</Button>
            </Link>
          ) : (
            <Link to="/client-dashboard">
              <Button variant="dark">Client Concerns</Button>
            </Link>
          )}
        </Nav>
        {!localStorage.getItem("user") ? (
          <>
            <Link to={"/login"}>
              <Button variant="dark">Login</Button>
            </Link>
            <Link to={"/signup"}>
              <Button variant="dark">Sign up</Button>
            </Link>
          </>
        ) : (
          <Button variant="dark" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
