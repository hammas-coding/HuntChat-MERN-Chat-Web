import React, { useState } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("id", data.user._id);
        navigate("/home");
      } else {
        alert(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Container className="main-container" fluid>
      <Row className="justify-content-md-center">
        <Col md={4}></Col>
        <Col md={4} className="mid-col">
          <div className="center-div-mid">
            <h2 className="heading">HuntChat Login</h2>
            <Form onSubmit={handleLogin}>
              <Form.Group
                controlId="formEmail"
                className="form-group input-wrapper"
              >
                <FaEnvelope className="input-icon" />
                <Form.Label className="form-label">Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </Form.Group>
              <Form.Group
                controlId="formPassword"
                className="form-group input-wrapper"
              >
                <FaLock className="input-icon" />
                <Form.Label className="form-label">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
              </Form.Group>
              <div className="button-div">
                <button className="button-register" type="submit">
                  Login
                </button>
              </div>
              <div className="register-link">
                <p>
                  Don't have an account? <Link to="/">Register</Link>
                </p>
              </div>
            </Form>
          </div>
        </Col>
        <Col md={4}></Col>
      </Row>
    </Container>
  );
};

export default Login;
