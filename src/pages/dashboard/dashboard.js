import React, { lazy, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { fetchUserData } from "../../api/authenticationService";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";

const MainWrapper = styled.div`
  padding-top: 40px;
`;
import useToken, { getToken, setAuthToken } from "../../api/useToken";
import LoginPage from "../LoginPage";
import axios from "axios";

export const Dashboard = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  if (token) {
    console.log(" token==================", token);
  }

  const handleSetInput = (event) => {
    const { value } = event.target;
    setMessage(value);
  };

  const logOut = () => {
    localStorage.clear();
    props.history.push("/");
  };

  // Received message from soket
  function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);
    console.log(message);
  }

  const sendMessage = () => {
    var chatMessage = {
      conversationId: "637ca15cc44b606b03889efc",
      content: [message],
      type: 0,
      accessToken: token,
    };

    try {
      stompClient.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify(chatMessage)
      );

      // Change userId
      stompClient.subscribe(
        "/user/6369be7ddddc35319a17cd28/chat",
        onMessageReceived
      );
    } catch (error) {
      console.log(error);
    }

    setMessage("");
  };

  // POST request using fetch()
  // const config = {
  //   headers: { Authorization: `Bearer ${token}` },
  // };

  // useEffect(() => {
  //   console.log("config", config);
  // }, [config]);
  // fetch(
  //   "https://ktpm-server.herokuapp.com/api/message/get-message-of-conversation",
  //   {
  //     // Adding method type
  //     method: "POST",

  //     // Adding body or contents to send
  //     body: JSON.stringify({
  //       conversationId: "637ca15cc44b606b03889efc",
  //       pageNumber: 0,
  //     }),

  //     // Adding headers to the request
  //     config,
  //   }
  // )
  //   // Converting to JSON
  //   .then((response) => response.json())

  //   // Displaying results to console
  //   .then((json) => {
  //     console.log(json);
  //     setData(json.data);
  //   });
  return (
    <Container>
      <MainWrapper>
        <h4>Test send message!</h4>
        <br></br>
        <Button style={{ marginTop: "5px" }} onClick={() => logOut()}>
          Logout
        </Button>
      </MainWrapper>

      {/* Message */}
      <MainWrapper></MainWrapper>

      {/* Conten  */}
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Nhập tin nhắn"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          onChange={handleSetInput}
          value={message}
        />
        <Button
          variant="outline-secondary"
          id="button-addon2"
          onClick={sendMessage}
        >
          Send
        </Button>
      </InputGroup>
    </Container>
  );
};
