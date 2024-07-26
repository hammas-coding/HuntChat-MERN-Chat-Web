import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  ListGroup,
  Modal,
} from "react-bootstrap";
import io from "socket.io-client";
import "./Chatroom.css";
import { FaPlus } from "react-icons/fa";

const socket = io("http://localhost:5000");

const Chatroom = () => {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const messagesEndRef = useRef(null); 
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("notification", (notification) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: notification.message, user: "System" },
      ]);
    });

    fetchRooms(token);

    return () => {
      socket.off("message");
      socket.off("notification");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchRooms = (token) => {
    fetch("http://localhost:5000/api/chatroom", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setRooms(data.rooms);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  };

  const joinRoom = (roomName) => {
    if (username && roomName) {
      setRoom(roomName);
      socket.emit("setUsername", username);
      socket.emit("joinRoom", { username, room: roomName });
      setMessages([]);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      socket.emit("sendMessage", { username, room, message });
      setMessage("");
    }
  };

  const createRoom = () => {
    const token = localStorage.getItem("authToken");
    if (newRoom.trim() !== "") {
      fetch("http://localhost:5000/api/chatroom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ room: newRoom }),
      })
        .then((response) => response.json())
        .then((data) => {
          setNewRoom(""); 
          setShowPopup(false); 
          fetchRooms(token); 
        })
        .catch((error) => {
          console.error("Error creating room:", error);
        });
    }
  };

  return (
    <Container className="main-container" fluid>
      <Row>
        <Col md={3}></Col>
        <Col md={6} className="mid-col">
          <div className="center-div-mid">
            <Container fluid style={{ padding: 0 }}>
              <Row>
                <Col md={4} className="user-list">
                  <div className="add-button-div heading">
                    <h2>Rooms</h2>
                    <FaPlus
                      className="plus-icon"
                      onClick={() => setShowPopup(true)}
                    />
                  </div>
                  <ListGroup className="rooms mt-2">
                    {rooms.map((roomObj, index) => (
                      <ListGroup.Item
                        key={index}
                        onClick={() => joinRoom(roomObj.name)}
                        className="usernames-list-item"
                      >
                        {roomObj.name}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Modal
                    show={showPopup}
                    onHide={() => setShowPopup(false)}
                    centered
                  >
                    <Modal.Header className="modal-main">
                      <Modal.Title style={{ color: "#fff" }}>
                        Create New Room
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-main">
                      <Form.Control
                        type="text"
                        placeholder="Room Name"
                        value={newRoom}
                        onChange={(e) => setNewRoom(e.target.value)}
                      />
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: "#201e43" }}>
                      <button
                        className="button-send"
                        onClick={() => setShowPopup(false)}
                      >
                        Close
                      </button>
                      <button className="button-send" onClick={createRoom}>
                        Create Room
                      </button>
                    </Modal.Footer>
                  </Modal>
                </Col>
                <Col md={8} className="chat-section d-flex flex-column">
                  {room ? (
                    <>
                      <h2 className="heading">Chat in {room}</h2>
                      <ListGroup
                        className="messages flex-grow-1"
                        style={{ overflowY: "auto", maxHeight: "400px" }}
                      >
                        {messages.map((msg, index) => (
                          <ListGroup.Item
                            key={index}
                            className={
                              msg.user === username
                                ? "sent-message"
                                : "received-message"
                            }
                          >
                            <strong>{msg.user}: </strong>
                            {msg.text}
                          </ListGroup.Item>
                        ))}
                        <div ref={messagesEndRef} /> 
                      </ListGroup>
                      <Form onSubmit={sendMessage} className="form-container">
                        <Form.Control
                          type="text"
                          placeholder="Type a message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="form-input-private"
                        />
                        <button type="submit" className="button-send">
                          Send
                        </button>
                      </Form>
                    </>
                  ) : (
                    <div className="no-chat">
                      <h4>No chat available. Please select a room.</h4>
                    </div>
                  )}
                </Col>
              </Row>
            </Container>
          </div>
        </Col>
        <Col md={3}></Col>
      </Row>
    </Container>
  );
};

export default Chatroom;
