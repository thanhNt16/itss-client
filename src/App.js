import React, { useState, useEffect } from "react";
import clsx from "clsx";
import swal from "sweetalert";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import {
  Grid,
  TextField,
  Typography,
  Button,
  Switch,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import io from "socket.io-client";

const useStyles = makeStyles({
  titleBackground: {
    background: "#4299e1",
  },
  matrix: {
    height: "auto",
  },
  box: {
    width: 80,
    height: 80,
    border: "3px solid #4299e1",
  },
  noBorderRight: {
    borderRightColor: "white",
  },
});
const socket = io("127.0.0.1:5000");

function App() {
  const [connected, setConnected] = useState(false);
  const [robotID, setRobotID] = useState(null);
  const [robotList, setRobotList] = useState([]);
  const [auto, setAuto] = useState(false);
  const classes = useStyles();
  const matrix = [
    [1, 2, 3, 4],
    [1, 1, 1, 5],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
  ];
  function handleKeyPress(event) {
    if (event.keyCode === 13) {
      console.log("Enter key pressed");
    }
  }
  useEffect(() => {
    socket.open();
    socket.on("connect", () => {
      console.log(socket.connected); // true
    });
    socket.emit("robot_list", function (data) {
      console.log(data);
      setRobotList(data);
    });
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    function keyHandling(e) {
      if (robotID) {
        switch (e.keyCode) {
          case 37:
            // alert("press arrow left");
            socket.emit("manual", { id: robotID, action: "left" });

            break;
          case 38:
            // alert("press arrow up");
            socket.emit("manual", { id: robotID, action: "forward" });
            break;
          case 39:
            // alert("press arrow right");
            socket.emit("manual", { id: robotID, action: "right" });
            break;
          case 40:
            // alert("press arrow down");
            socket.emit("manual", { id: robotID, action: "down" });
            break;
          case 80:
            //press p
            // alert("press arrow down");
            socket.emit("manual", { id: robotID, action: "pick" });
            break;
          case 68:
            socket.emit("manual", { id: robotID, action: "drop" });
            break;
          default:
            console.log("other key");
            break;
        }
      } else {
        swal("Oops!", "You should select a robot first", "error");
      }
    }
    window.addEventListener("keydown", keyHandling);

    return () => {
      window.removeEventListener("keydown", keyHandling);
    };
  }, [robotID]);

  function handleClick(type) {
    if (robotID) {
      switch (type) {
        case "forward":
          socket.emit("manual", { id: robotID, action: "forward" });
          break;
        case "left":
          socket.emit("manual", { id: robotID, action: "left" });
          break;
        case "right":
          socket.emit("manual", { id: robotID, action: "right" });
          break;
        case "down":
          socket.emit("manual", { id: robotID, action: "down" });
          break;
        case "pick":
          socket.emit("manual", { id: robotID, action: "pick" });
          break;

        case "drop":
          socket.emit("manual", { id: robotID, action: "drop" });
          break;
        default:
          break;
      }
    } else {
      console.log("Please choose robot first");
      swal("Oops!", "You should select a robot first", "error");
    }
  }

  return (
    <div onKeyDown={handleKeyPress} className="w-full h-full p-12">
      <div
        className={clsx(
          classes.titleBackground,
          "m-auto w-4/5 h-28 flex justify-center bg-orange-500 mb-8"
        )}
      >
        <Typography
          className="text-white"
          variant="h3"
          component="h3"
          gutterBottom
        >
          Robot Warehouse Management System
        </Typography>
      </div>
      <Grid container>
        <Grid item xs={12} md={6} className="flex justify-center">
          <div className={classes.matrix}>
            {matrix.map((item, ind) => {
              return (
                <div key={ind} className="flex">
                  {item.map((el, index) => {
                    return (
                      <div
                        key={index}
                        className={
                          index === item.length - 1
                            ? clsx(
                                classes.box,
                                "flex justify-center items-center"
                              )
                            : clsx(
                                classes.box,
                                classes.noBorderRight,
                                "flex justify-center items-center"
                              )
                        }
                      >
                        {el}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </Grid>
        <Grid item xs={12} md={6} className="flex justify-center">
          <div className={clsx("w-64 h-64", classes.titleBackground)}></div>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} md={6} className="flex flex-col pr-20 pl-20">
          <div className="flex mt-8 justify-between w-full">
            <FormControl className="w-1/3" variant="outlined">
              <InputLabel className="w-full">Robot ID</InputLabel>
              <Select
                fullWidth
                value={robotID}
                onChange={(e) => setRobotID(e.target.value)}
              >
                {robotList.map((item) => {
                  return <MenuItem value={item}>{item}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <TextField
              label="Starting Point"
              variant="outlined"
              inputProps={{
                style: { borderColor: "#4299e1", color: "#4299e1" },
              }}
            />
          </div>
          <div className="flex mt-8 justify-between w-full">
            <TextField
              label="Heading Point"
              variant="outlined"
              inputProps={{
                style: { borderColor: "#4299e1", color: "#4299e1" },
              }}
            />
            <Button
              variant="contained"
              style={{ background: "#4299e1", color: "#fff" }}
            >
              Submit
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} md={6} className="flex flex-col pr-20 pl-20">
          <Typography variant="h5">Auto Mode</Typography>
          <Switch
            checked={auto}
            onChange={() => setAuto(!auto)}
            name="auto"
            color="primary"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
          {!auto && (
            <div className="w-full h-auto">
              <div className="w-full flex justify-center">
                <Button
                  onClick={() => handleClick("forward")}
                  style={{ background: "#4299e1", color: "#fff" }}
                >
                  <ArrowUpwardIcon />
                </Button>
              </div>
              <div className="w-full flex justify-around">
                <Button
                  onClick={() => handleClick("left")}
                  style={{ background: "#4299e1", color: "#fff" }}
                >
                  <ArrowBackIcon />
                </Button>

                <Button
                  onClick={() => handleClick("right")}
                  style={{ background: "#4299e1", color: "#fff" }}
                >
                  <ArrowForwardIcon />
                </Button>
              </div>
              <div className="w-full flex justify-center">
                <Button
                  onClick={() => handleClick("down")}
                  style={{ background: "#4299e1", color: "#fff" }}
                >
                  <ArrowDownwardIcon />
                </Button>
              </div>
              <div className="w-full flex justify-around mt-8">
                <Button
                  onClick={() => handleClick("pick")}
                  variant="contained"
                  style={{
                    background: "#4299e1",
                    color: "#fff",
                  }}
                >
                  Pick
                </Button>
                <Button
                  onClick={() => handleClick("drop")}
                  variant="contained"
                  style={{ background: "#4299e1", color: "#fff" }}
                >
                  Drop
                </Button>
              </div>
            </div>
          )}
          {auto && (
            <div className="w-full h-auto flex justify-between">
              <TextField
                label="Starting Point"
                variant="outlined"
                inputProps={{
                  style: { borderColor: "#4299e1", color: "#4299e1" },
                }}
              />
              <Button
                variant="contained"
                style={{ background: "#4299e1", color: "#fff" }}
              >
                Start
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
