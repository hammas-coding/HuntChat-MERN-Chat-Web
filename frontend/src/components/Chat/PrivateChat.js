import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, ListGroup, Badge } from "react-bootstrap";
import io from "socket.io-client";
import "./PrivateChat.css";

const socket = io("http://localhost:5000");

const PrivateChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:5000/api/auth/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchMessages = async () => {
      if (!selectedUser) return;

      try {
        const token = localStorage.getItem("authToken");
        const id = localStorage.getItem("recipientId");
        console.log(id);
        const response = await fetch(
          `http://localhost:5000/api/privatechat/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setMessages(data);
        } else {
          console.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "");

    if (storedUsername) {
      socket.emit("setUsername", storedUsername);
    }

    fetchUsers();
    fetchMessages();

    const handlePrivateMessage = (message) => {
      if (message.from === selectedUser || message.to === selectedUser) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    const handleNotification = (notification) => {
      if (notification.from !== username) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          notification.from,
        ]);
      }
    };

    socket.on("privateMessage", handlePrivateMessage);
    socket.on("notification", handleNotification);

    return () => {
      socket.off("privateMessage", handlePrivateMessage);
      socket.off("notification", handleNotification);
    };
  }, [selectedUser]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      const newMessage = {
        from: username,
        to: selectedUser,
        text: message,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      socket.emit("sendPrivateMessage", newMessage);
      setMessage("");
    }
  };

  const handleSelectUser = (user) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif !== user.username)
    );
    setSelectedUser(user.username);
    localStorage.setItem("recipientId", user._id);
    setModalShow(false);
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
                  <h2 className="heading">Friends</h2>
                  <ListGroup>
                    {users.map((user) => (
                      <ListGroup.Item
                        key={user._id}
                        onClick={() => handleSelectUser(user)}
                        className={
                          notifications.includes(user.username)
                            ? "notification usernames-list-item"
                            : "usernames-list-item"
                        }
                      >
                        <span>{user.username}</span>
                        {notifications.includes(user.username) && (
                          <Badge pill bg="danger" className="ml-2">
                            ●
                          </Badge>
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
                <Col md={8} className="chat-section d-flex flex-column">
                  {selectedUser ? (
                    <>
                      <h2 className="heading">Chat with {selectedUser}</h2>
                      <ListGroup
                        className="messages flex-grow-1"
                        style={{ overflowY: "auto", maxHeight: "400px" }}
                      >
                        {messages.map((msg, index) => (
                          <ListGroup.Item
                            key={index}
                            className={
                              msg.from === username
                                ? "sent-message"
                                : "received-message"
                            }
                          >
                            <strong>{msg.from}:</strong> {msg.text}
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
                        <button className="button-send" type="submit">
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

export default PrivateChat;
