import React, { Component, useEffect, useState } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Button, Grid, Typography, ButtonGroup } from "@material-ui/core";

// For the router
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

const HomePage = () => {
  // const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState(null);

  // Equivalent to async componentDidMount() in class components
  useEffect(() => {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        if (data.code) {
          setRoomCode(data.code);
          console.log(data.code);
          //if code is not null
          // navigate(`/room/${data.code}`);
          // window.location.href = `/room/${data.code}`;
        }
      });
  }, []);

  const renderHomePage = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join a Room
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  };

  // if (roomCode) {
  //   return roomCode ? <Navigate to={`/room/${roomCode}`} /> : renderHomePage();
  // }

  return (
    <Router>
      <Routes>
        <Route path="/" element={renderHomePage()} />
        {/* render={() => { roomCode ? <Navigate to={`/room/${roomCode}`} /> : renderHomePage(); }} */}
        <Route path="/join" element={<RoomJoinPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/room/:roomCode" element={<Room />} />
        {/* :roomCode is a variable. This by default passes roomCode as "matched", which is just a param for how it got there, and we can use this to get the room */}
      </Routes>
    </Router>
  );
};
export default HomePage;
