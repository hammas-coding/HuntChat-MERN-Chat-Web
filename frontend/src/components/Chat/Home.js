import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaCommentDots, FaSignOutAlt } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout clicked");
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    localStorage.removeItem("recipientId");
    navigate("/login");
  };

  return (
    <Container className="main-container" fluid>
      <Row className="justify-content-md-center">
        <Col md={4}></Col>
        <Col md={4} className="mid-col">
          <div className="center-div-mid">
            <h2 className="heading">Welcome to HuntChat</h2>
            <div className="button-div">
              <button
                className="button-register"
                onClick={() => navigate("/chatroom")}
              >
                <FaUsers className="button-icon" /> Chatroom
              </button>
            </div>
            <div className="button-div">
              <button
                className="button-register"
                onClick={() => navigate("/privatechat")}
              >
                <FaCommentDots className="button-icon" /> Private Chat
              </button>
            </div>
            <div className="button-div">
              <button className="button-register" onClick={handleLogout}>
                <FaSignOutAlt className="button-icon" /> Logout
              </button>
            </div>
          </div>
        </Col>
        <Col md={4}></Col>
      </Row>
    </Container>
  );
};

export default Home;
