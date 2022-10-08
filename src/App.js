import "./App.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AddEvent from "./components/AddEvent/AddEvent";
import "bootstrap/dist/css/bootstrap.css";

import EventDisplay from "./components/Events/EventDisplay";
import { useEffect, useState } from "react";

let isInitial = true;

function App() {
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [time, setTime] = useState();
  const [event, setEvent] = useState();
  const [spinner, setSpinner] = useState(true);
  console.log("initial", isInitial);

  const setTimeHandler = (event) => {
    setTime(event.target.value);
  };

  const setEventHandler = (event) => {
    setEvent(event.target.value);
  };

  const [eventsList, setEventsList] = useState([]);
  const [eventsListChanged, setEventsListChanged] = useState(false);

  // useEffect(() => {
  //   const fetchEventList = async () => {
  //     try {
  //       const response = await fetch(
  //         "https://calendar-app-6ec33-default-rtdb.firebaseio.com/eventList.json"
  //       );

  //       const data = await response.json();
  //       setEventsList(data);
  //       setSpinner(false);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   if (isInitial) {
  //     setSpinner(true);
  //     fetchEventList();
  //   }
  // }, []);
  useEffect(() => {
    console.log(eventsList);

    const fetchEventList = async () => {
      try {
        const response = await fetch(
          "https://calendar-app-6ec33-default-rtdb.firebaseio.com/eventList.json"
        );

        const data = await response.json();
        if (data !== null) {
          setEventsList(data);
        } else {
          setEventsList([]);
        }
        setSpinner(false);
      } catch (err) {
        console.log(err);
      }
    };

    const postServer = async () => {
      try {
        const response = await fetch(
          "https://calendar-app-6ec33-default-rtdb.firebaseio.com/eventList.json",
          {
            method: "PUT",
            body: JSON.stringify(eventsList),
          }
        );
        // setSpinner(false);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };

    if (isInitial && !eventsListChanged) {
      isInitial = false;
      setSpinner(true);
      fetchEventList();
      return;
    } else if (eventsListChanged) {
      // setSpinner(true);
      postServer();
    }
  }, [eventsList, eventsListChanged]);

  const sortEvents = (eventListTemp) => {
    return eventListTemp.map((event) => {
      event.events.sort((a, b) => {
        console.log("inside sort");
        console.log(a, b);
        if (a.time < b.time) {
          return -1;
        }
        if (a.time > b.time) {
          return 1;
        }
        return 0;
      });
      return event;
    });
  };

  const setEventsListHandler = () => {
    const calendarDateTemp = calendarDate.toLocaleDateString();
    console.log(calendarDateTemp);
    setTime("");
    setEvent("");
    if (eventsList.length === 0) {
      setEventsListChanged(true);
      setEventsList([
        {
          date: calendarDateTemp,
          events: [
            {
              id:
                calendarDateTemp +
                "_" +
                String(Math.floor(Math.random() * 10000)),
              time: time,
              title: event,
            },
          ],
        },
      ]);
    } else {
      setEventsListChanged(true);
      setEventsList((eventList) => {
        let eventListTemp = [...eventList];
        const dateIndex = eventListTemp.findIndex(
          (event) => event.date === calendarDateTemp
        );
        console.log(eventListTemp);
        console.log(dateIndex);
        if (dateIndex >= 0) {
          let id =
            calendarDateTemp + "_" + String(Math.floor(Math.random() * 10000));
          eventListTemp[dateIndex].events.push({
            id: id,
            time: time,
            title: event,
          });
          return sortEvents(eventListTemp);
        } else {
          eventListTemp.push({
            date: calendarDateTemp,
            events: [
              {
                id:
                  calendarDateTemp +
                  "_" +
                  String(Math.floor(Math.random() * 10000)),
                time: time,
                title: event,
              },
            ],
          });
          return sortEvents(eventListTemp);
        }
      });
    }
  };

  const deleteEventHandler = (calendarDate, id) => {
    console.log("remove", calendarDate, id);
    let eventsListTemp = [...eventsList];
    setEventsListChanged(true);
    for (var i = 0; i < eventsListTemp.length; i++) {
      if (eventsListTemp[i].date === calendarDate) {
        if (eventsListTemp[i].events.length > 1) {
          for (var j = 0; j < eventsListTemp[i].events.length; j++) {
            if (eventsListTemp[i].events[j].id === id) {
              eventsListTemp[i].events.splice(j, 1);
            }
          }
        } else {
          eventsListTemp.splice(i, 1);
        }
      }
    }
    setEventsList(eventsListTemp);
  };

  return (
    <div className="App">
      <div>
        <Calendar onChange={setCalendarDate} value={calendarDate}></Calendar>
      </div>
      <div className="eventBox">
        <EventDisplay
          data={{
            events: eventsList,
            date: calendarDate,
            deleteEvent: { handler: deleteEventHandler },
            spinner: spinner,
          }}
        ></EventDisplay>
        <AddEvent
          data={{
            time: { value: time, handler: setTimeHandler },
            event: { value: event, handler: setEventHandler },
            addEvent: { handler: setEventsListHandler },
          }}
        ></AddEvent>
      </div>
    </div>
  );
}

export default App;
