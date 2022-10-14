import React from "react";
import "./EventDisplay.css";
import Card from "react-bootstrap/Card";
import CloseButton from "react-bootstrap/CloseButton";
import Loading from "../Loading/Loading";

const EventDisplay = (props) => {
  const calendarDateTemp = props.data.date.toLocaleDateString();
  console.log("Calendar Date:", calendarDateTemp);
  console.log("Event List:", props.data.events);
  const dateObj = props.data.events.filter(
    (obj) => obj.date === calendarDateTemp
  );
  console.log("Date Object", dateObj.length);
  console.log("loading", props.data.spinner);
  return (
    <div className="events">
      {!props.data.spinner ? (
        dateObj.length !== 0 ? (
          dateObj[0].events.map((event) => {
            return (
              <Card
                key={event.id}
                style={{
                  marginRight: "7px",
                  fontStyle: "italic",
                  textTransform: "capitalize",
                  fontSize: "13px",
                  marginBottom: "5px",
                }}
              >
                <Card.Body style={{ padding: "5px 8px 5px 8px" }}>
                  {event.time} &nbsp;&#8212;&nbsp; {event.title}
                  <CloseButton
                    style={{ float: "right", fontSize: "13px" }}
                    className={"shadow-none"}
                    onClick={() =>
                      props.data.deleteEvent.handler(calendarDateTemp, event.id)
                    }
                  />
                </Card.Body>
              </Card>
            );
          })
        ) : (
          <p style={{ textAlign: "center", fontStyle: "italic" }}>
            No events scheduled for the day!
          </p>
        )
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default EventDisplay;
