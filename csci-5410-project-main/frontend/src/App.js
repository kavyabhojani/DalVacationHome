import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarComponent from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SecondFactorAuth from "./pages/SecondFactorAuth";
import ThirdFactorAuth from "./pages/ThirdFactorAuth";
import SecondLogin from "./pages/SecondLogin";
import ThirdLogin from "./pages/ThirdLogin";
import Chat from "./components/Chat";
import RoomDetails from "./pages/RoomDetails";
import AddRoom from "./pages/AddRoom";
import EditRoom from "./pages/EditRoom";
import AgentDashboard from "./components/AgentDashboard";
import ClientDashboard from "./components/ClientDashboard";
import StatisticsDashboard from "./pages/StatisticsDashboard";

function App() {
  return (
    <Router>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/second-login" element={<SecondLogin />} />
        <Route path="/third-login" element={<ThirdLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/2fauth" element={<SecondFactorAuth />} />
        <Route path="/3fauth" element={<ThirdFactorAuth />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/add-room" element={<AddRoom />} />
        <Route path="/edit-room/:id" element={<EditRoom />} />
        <Route path="/agent-dashboard" element={<AgentDashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/statistics-dashboard" element={<StatisticsDashboard />} />
      </Routes>
      <Chat />
    </Router>
  );
}

export default App;
