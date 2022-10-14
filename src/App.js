import "./App.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AddEvent from "./components/AddEvent/AddEvent";
import "bootstrap/dist/css/bootstrap.css";

import EventDisplay from "./components/Events/EventDisplay";
import { useEffect, useState, useCallback } from "react";
import Authentication from "./components/Authentication/Authentication";

let isInitial = true;
let logOutTimer;

export const authToken = "AIzaSyD8IUqYm3T0PZ3jDwW67ufMcduiWdALXb0";

function App() {
  const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();

    const remainingDuration = adjExpirationTime - currentTime;

    return remainingDuration;
  };
  const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem("token");
    const storedExpirationDate = localStorage.getItem("expirationTime");
    const storedEmail = localStorage.getItem("email");

    console.log(storedExpirationDate);

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if (remainingTime <= 3600) {
      localStorage.removeItem("token");
      localStorage.removeItem("expirationTime");
      localStorage.removeItem("email");
      return null;
    }

    return { token: storedToken, duration: remainingTime, email: storedEmail };
  };
  const tokenData = retrieveStoredToken();
  let initialToken;
  let initialLoggedIn;
  let initialEmail;
  if (tokenData) {
    initialToken = tokenData.token;
    initialLoggedIn = true;
    initialEmail = tokenData.email;
    console.log("TokenData", tokenData, initialToken);
  } else {
    initialLoggedIn = false;
    initialToken = "";
    initialEmail = "";
  }

  const logoutHandler = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("email");
    if (logOutTimer) {
      clearTimeout(logOutTimer);
    }
    window.location.reload();
  }, []);
  const [auth, setAuth] = useState({
    token: initialToken,
    isLoggedIn: initialLoggedIn,
    email: initialEmail,
  });
  console.log(auth);
  const [switchMode, setSwitchMode] = useState(true);
  const [emailInput, setEmailInput] = useState();
  const [passwordInput, setPasswordInput] = useState();

  const switchAuthModeHandler = () => {
    setSwitchMode((prevState) => !prevState);
  };
  const setEmailHandler = (event) => {
    setEmailInput(event.target.value);
  };
  const setPasswordHandler = (event) => {
    setPasswordInput(event.target.value);
  };
  const submitHandler = (event) => {
    event.preventDefault();
    console.log("submit clicked");
    if (!emailInput && !passwordInput) {
      alert("Please input email address and password!");
      return;
    }

    let url;
    if (switchMode) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
    } else {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
    }
    fetch(url + authToken, {
      method: "POST",
      body: JSON.stringify({
        email: emailInput,
        password: passwordInput,
        returnSecureToken: true,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            let errorMessage = data.error.message;
            if (data && data.error && data.error.message) {
              console.log(data.error.message);
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        setAuth({ token: data.idToken, isLoggedIn: true, email: data.email });
        localStorage.setItem("token", data.idToken);
        localStorage.setItem("expirationTime", data.expiresIn);
        localStorage.setItem("email", data.email);
        setEmailInput("");
        setPasswordInput("");
        console.log(data);
        const remainingTime = calculateRemainingTime(data.expiresIn);
        console.log(remainingTime);
        logOutTimer = setTimeout(logoutHandler, remainingTime);
      })
      .catch((error) => alert(error.message));
  };

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
        console.log("email", auth.email);

        const name = auth.email.split("@");
        const response = await fetch(
          `https://calendar-app-6ec33-default-rtdb.firebaseio.com/${name[0]}.json`
        );

        const data = await response.json();
        if (data !== null) {
          console.log(data);
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
        const name = auth.email.split("@");
        const response = await fetch(
          `https://calendar-app-6ec33-default-rtdb.firebaseio.com/${name[0]}.json`,
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

    if (isInitial && !eventsListChanged && auth.isLoggedIn) {
      isInitial = false;
      setSpinner(true);
      fetchEventList();
      return;
    } else if (eventsListChanged && auth.isLoggedIn) {
      // setSpinner(true);
      postServer();
    }
  }, [eventsList, eventsListChanged, auth.email, auth.isLoggedIn]);

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

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData);
      logOutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  return (
    <div className="App">
      {!auth.isLoggedIn ? (
        <Authentication
          data={{
            email: { value: emailInput, handler: setEmailHandler },
            password: { value: passwordInput, handler: setPasswordHandler },
            submit: submitHandler,
            switchAuthModeHandler: {
              handler: switchAuthModeHandler,
              value: switchMode,
            },
            auth: auth,
          }}
        ></Authentication>
      ) : (
        <>
          <div className="header">
            Welcome Back {auth.email}!{" "}
            <span style={{ float: "right" }}>
              <button
                className="logout"
                style={{ fontSize: "15px" }}
                onClick={logoutHandler}
              >
                Logout
              </button>
            </span>
          </div>
          <div style={{ display: "flex" }}>
            <div>
              <Calendar
                onChange={setCalendarDate}
                value={calendarDate}
              ></Calendar>
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
        </>
      )}
    </div>
  );
}

export default App;
