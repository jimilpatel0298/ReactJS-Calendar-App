import React from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./Authentication.css";

const Authentication = (props) => {
  return (
    <div className="authentication">
      <FloatingLabel
        controlId="floatingInput"
        label="Email address"
        className="mb-3"
      >
        <Form.Control
          type="email"
          placeholder="name@example.com"
          value={props.data.email.value}
          onChange={props.data.email.handler}
        />
      </FloatingLabel>
      <FloatingLabel controlId="floatingPassword" label="Password">
        <Form.Control
          type="password"
          placeholder="Password"
          value={props.data.password.value}
          onChange={props.data.password.handler}
        />
      </FloatingLabel>
      <Button
        className="loginButton"
        variant="success"
        onClick={props.data.submit}
      >
        {props.data.switchAuthModeHandler.value ? "Login" : "Create Account"}
      </Button>
      <button
        className="registerButton"
        onClick={props.data.switchAuthModeHandler.handler}
      >
        or {props.data.switchAuthModeHandler.value ? "Register" : "Login"}
      </button>
    </div>
  );
};

export default Authentication;
