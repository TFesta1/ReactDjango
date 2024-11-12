import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Radio } from "@material-ui/core";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link } from "react-router-dom";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const CreateRoomPage = ({
  votesToSkipProp = 2,
  updateProp = false,
  guestCanPauseProp = true,
  roomCodeProp = null,
  updateCallbackProp = () => {},
}) => {
  // const defaultVotes = "2";
  // const defaultProps = {
  //   votesToSkip: 2,
  //   guestCanPause: true,
  //   update: false,
  //   roomCode: null,
  //   updateCallback: () => {},
  // }
  // CreateRoomPage.defaultProps = {
  //   votesToSkip: 2,
  //   guestCanPause: true,
  //   update: false,
  //   roomCode: null,
  //   updateCallback: () => {},
  // };
  const [update, setUpdate] = useState(updateProp);
  console.log(`update: ${update}`);
  console.log(`updateProp: ${updateProp}`);
  const [guestCanPause, setGuestCanPause] = useState(guestCanPauseProp);
  const [votesToSkip, setVotesToSkip] = useState(votesToSkipProp);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true");
  };

  const handleRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };

    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate("/room/" + data.code));
  };

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: roomCodeProp,
      }),
    };

    fetch("/api/update-room", requestOptions).then((response) => {
      if (response.ok) {
        setSuccessMsg("Room Updated Successfully!");
      } else {
        setErrorMsg("Error updating room...");
      }
      updateCallbackProp();
    });
  };

  function renderCreateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center" onClick={handleRoomButtonPressed}>
          <Button color="primary" variant="contained">
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }

  function renderUpdateButtons() {
    return (
      <Grid item xs={12} align="center" onClick={handleUpdateButtonPressed}>
        <Button color="primary" variant="contained">
          Update Room
        </Button>
      </Grid>
    );
  }

  function render() {
    const title = update ? "Update Room" : "Create A Room";

    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Collapse in={errorMsg != "" || successMsg != ""}>
            {successMsg != "" ? (
              <Alert
                severity="success"
                onClose={() => {
                  setSuccessMsg("");
                }}
              >
                {successMsg}
              </Alert>
            ) : (
              <Alert
                severity="error"
                onClose={() => {
                  setErrorMsg("");
                }}
              >
                {errorMsg}
              </Alert>
            )}
          </Collapse>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText>
              <div align="center">Guest Control of Playback State</div>
            </FormHelperText>
            <RadioGroup
              row
              defaultValue={guestCanPause.toString()}
              onChange={handleGuestCanPauseChange}
            >
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="Play/Pause"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="false"
                control={<Radio color="secondary" />}
                label="No Control"
                labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              type="number"
              onChange={handleVotesChange}
              defaultValue={votesToSkip}
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
            />
            <FormHelperText>
              <div align="center">Votes Required to Skip Song</div>
            </FormHelperText>
          </FormControl>
        </Grid>
        {update ? renderUpdateButtons() : renderCreateButtons()}
      </Grid>
    );
  }
  return render();
};

export default CreateRoomPage;
