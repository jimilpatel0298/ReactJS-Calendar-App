import React from "react";
import "./AddEvent.css";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const AddEvent = (props) => {
  return (
    <div className="addEvent">
      <InputGroup size="sm" style={{ Width: "380px" }}>
        <Row>
          <Col sm="6" style={{ paddingRight: "0px" }}>
            <Form.Control
              placeholder="Add an event..."
              aria-label="Enter your event"
              value={props.data.event.value}
              onChange={props.data.event.handler}
              style={{
                border: "none",
                borderBottom: "1px solid black",
                borderRadius: "0px",
              }}
              className={"shadow-none"}
            />
          </Col>
          <Col sm="3" style={{ padding: "0" }}>
            <Form.Control
              type="time"
              placeholder="15:00"
              aria-label="Time"
              value={props.data.time.value}
              onChange={props.data.time.handler}
              style={{
                border: "none",
                borderBottom: "1px solid black",
                borderRadius: "0px",
              }}
              className={"shadow-none"}
            />
          </Col>
          <Col sm="2" style={{ padding: "0 0 0 10px" }}>
            <Button
              variant="dark"
              onClick={props.data.addEvent.handler}
              disabled={
                props.data.event.value && props.data.time.value ? false : true
              }
              style={{
                borderRadius: "5px",
                width: "72px",
                fontSize: "13px",
                height: "38px",
              }}
            >
              Add
            </Button>
          </Col>
        </Row>
      </InputGroup>
    </div>
  );
};

export default AddEvent;
