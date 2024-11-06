import React, { useEffect, useState } from "react";
import { Grid, Typography, Button, ButtonGroup } from "@material-ui/core";
import { useNavigate, Link, Navigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        if (data.code) {
          setRoomCode(data.code);
          console.log(data.code);
          navigate(`/room/${data.code}`);
        }
      });
  }, [navigate]);

  const renderHomePage = () => (
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

  return roomCode ? <Navigate to={`/room/${roomCode}`} /> : renderHomePage();
};

export default HomePage;
