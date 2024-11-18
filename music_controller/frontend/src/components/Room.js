import React, { Component, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";

// Class based component
// export default class Room extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       votesToSkip: 2,
//       guestCanPause: false,
//       isHost: false,
//     };
//     this.roomCode = this.props.match.params.roomCode; //props store info about how we got to this page
//   }

//   render() {
//     return (
//       <div>
//         <h3>{this.roomCode}</h3>
//         <p>{this.state.votesToSkip}</p>
//         <p>Guest Can Pause: {this.state.guestCanPause}</p>
//         <p>Host: {this.state.isHost}</p>
//       </div>
//     );
//   }
// }

// Functional component, better, and only works with useParams
function Room() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [state, setState] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
    spotifyAuthenticated: false,
  });

  function updateShowSettings(value) {
    setState({ showSettings: value });
  }

  const getRoomDetails = () => {
    fetch("/api/get-room" + "?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
          navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
        console.log(`isHost: ${state.isHost}`);
        if (state.isHost) {
          authenticateSptoify();
        }
      });
  };

  const localCallBackProp = () => {
    getRoomDetails();
    updateShowSettings(false);
  };

  useEffect(() => {
    getRoomDetails();
  }, []);

  function renderSettings() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            updateProp={true}
            votesToSkipProp={state.votesToSkip}
            guestCanPauseProp={state.guestCanPause}
            roomCodeProp={roomCode}
            updateCallbackProp={getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => localCallBackProp}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  function renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  }

  useEffect(() => {
    getRoomDetails();
  }, [roomCode]);

  function authenticateSptoify() {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setState({ spotifyAuthenticated: data.status });
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  }

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    // _response means we do not care about the response
    fetch("/api/leave-room", requestOptions).then((_response) => {
      navigate("/");
    });
  };

  if (state.showSettings) {
    return renderSettings();
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Votes: {state.votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Guest Can Pause: {state.guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Host: {state.isHost.toString()}
        </Typography>
      </Grid>
      {state.isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button
          color="secondary"
          variant="contained"
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>

    // <div>
    //   <h3>{roomCode}</h3>
    //   <p>Votes: {state.votesToSkip}</p>
    //   <p>Guest Can Pause: {state.guestCanPause.toString()}</p>
    //   <p>Host: {state.isHost.toString()}</p>
    // </div>
  );
}
export default Room;
