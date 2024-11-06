import React, { Component, useEffect, useState } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import HomePageComponent from "./HomePageComponent";
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

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={renderHomePage()} /> */}
        <Route path="/" element={<HomePageComponent />} />
        {/* render={() => { roomCode ? <Navigate to={`/room/${roomCode}`} /> : renderHomePage(); }} */}
        <Route path="/join" element={<RoomJoinPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/room/:roomCode" element={<Room />} />
        {/* :roomCode is a variable. This by default passes roomCode as "matched", which is just a param for how it got there, and we can use this to get the room */}
      </Routes>
    </Router>
  );
};
export default App;
