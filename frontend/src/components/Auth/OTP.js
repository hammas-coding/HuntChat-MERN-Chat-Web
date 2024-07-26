import React, { useState } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaKey } from "react-icons/fa";
import "./OTP.css";

const OTP = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || ""); 
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        alert(data.message || "OTP verification failed. Please try again.");
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
            <h2 className="heading">OTP Verification</h2>
            <Form onSubmit={handleVerify}>
              <Form.Group controlId="formEmail" className="form-group">
                <Form.Label className="form-label">Email address</Form.Label>
                <div className="input-wrapper">
                  <FaEnvelope className="input-icon-register" />
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    className="form-input"
                    readOnly
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="formOtp" className="form-group">
                <Form.Label className="form-label">OTP</Form.Label>
                <div className="input-wrapper">
                  <FaKey className="input-icon-register" />
                  <Form.Control
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="form-input"
                  />
                </div>
              </Form.Group>
              <div className="button-div">
                <button className="button-register" type="submit">
                  Verify
                </button>
              </div>
            </Form>
          </div>
        </Col>
        <Col md={4}></Col>
      </Row>
    </Container>
  );
};

export default OTP;
