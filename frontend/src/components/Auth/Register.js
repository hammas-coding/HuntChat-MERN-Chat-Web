import React, { useState } from "react";
import { Form,  Container, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        profilePic,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        navigate("/otp", { state: { email } });
      });
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ecom-store");

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dtys2qg58/image/upload`,
          formData
        );
        setProfilePic(response.data.secure_url);
      } catch (error) {
        console.error("Error uploading image", error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container className="main-container" fluid>
      <Row className="justify-content-md-center">
        <Col md={4}></Col>
        <Col md={4} className="mid-col">
          <div className="center-div-mid">
            <h2 className="heading">HuntChat Registration</h2>
            <Form onSubmit={handleRegister} className="register-form">
              <div className="profile-pic-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="profile-pic-input"
                  onChange={handleProfilePicChange}
                />
                <label htmlFor="profile-pic-input">
                  <div
                    className="profile-pic"
                    style={{ backgroundImage: `url(${profilePic})` }}
                  ></div>
                </label>
              </div>
              <Form.Group controlId="formUsername" className="form-group">
                <Form.Label className="form-label">Username</Form.Label>
                <div className="input-wrapper">
                  <FaUser className="input-icon-register" />
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="formEmail" className="form-group">
                <Form.Label className="form-label">Email address</Form.Label>
                <div className="input-wrapper">
                  <FaEnvelope className="input-icon-register" />
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="formPassword" className="form-group">
                <Form.Label className="form-label">Password</Form.Label>
                <div className="input-wrapper">
                  <FaLock className="input-icon-register" />
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </Form.Group>
              <div className="button-div">
                <button className="button-register" type="submit">
                  Register
                </button>
              </div>
            </Form>
            <div className="login-link">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </Col>
        <Col md={4}></Col>
      </Row>
    </Container>
  );
};

export default Register;
