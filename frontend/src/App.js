import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Auth/Register";
import OTP from "./components/Auth/OTP";
import Login from "./components/Auth/Login";
import Home from "./components/Chat/Home";
import Chatroom from "./components/Chat/Chatroom";
import PrivateChat from "./components/Chat/PrivateChat";
import "./App.css";
function App() {
  const [selectedUser, setSelectedUser] = useState("");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chatroom" element={<Chatroom />} />
        <Route
          path="/privatechat"
          element={<PrivateChat selectedUser={selectedUser} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
