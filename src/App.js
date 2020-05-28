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

const host = "https://itss-server.herokuapp.com/";

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
const socket = io(host);
var count = 0;

const init = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

function App() {
  const [currentKey, setCurrentKey] = useState("");
  const [robotID, setRobotID] = useState("");
  const [robotList, setRobotList] = useState([]);
  const [auto, setAuto] = useState(false);
  const classes = useStyles();
  const [matrix, setMatrix] = useState(JSON.stringify(init));
  const [start, setStart] = useState("0,0")
  const [heading, setHeading] = useState("0,0")

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
    socket.on('update_coordinate', (id, x, y) => {
      console.log(id, x, y)
    })
  })

  useEffect(() => {
    socket.on("robot_connected", (id) => {
      console.log("Robot connected ", id);
      socket.emit("robot_list", function (data) {
        console.log(data);
        setRobotList(data);
      });
    });
    socket.on("robot_disconnected", (id) => {
      console.log("Robot disconnected ", id);
      socket.emit("robot_list", function (data) {
        console.log(data);
        setRobotList(data);
      });
    });
  });

  useEffect(() => {
    function keyHandling(e) {
      // if (robotID) {
      switch (e.keyCode) {
        case 37:
          // alert("press arrow left");
          if (currentKey !== "left") {
            count = 0;
            setCurrentKey("left");
          }
          count++;
          if (count >= 3) {
            count = 0;

            socket.emit("manual", { id: robotID, action: "left" });
          }
          break;
        case 38:
          // alert("press arrow up");
          if (currentKey !== "forward") {
            count = 0;
            setCurrentKey("forward");
          }

          count++;

          if (count >= 3) {
            count = 0;
            socket.emit("manual", { id: robotID, action: "forward" });
          }
          break;
        case 39:
          // alert("press arrow right");
          if (currentKey !== "right") {
            count = 0;
            setCurrentKey("right");
          }

          count++;

          if (count >= 3) {
            count = 0;
            socket.emit("manual", { id: robotID, action: "right" });
          }
          break;
        case 40:
          // alert("press arrow down");
          if (currentKey !== "backward") {
            count = 0;
            setCurrentKey("backward");
          }

          count++;

          if (count >= 3) {
            count = 0;
            socket.emit("manual", { id: robotID, action: "backward" });
          }
          break;
        case 80:
          //press p
          if (currentKey !== "up") {
            count = 0;
            setCurrentKey("up");
          }

          count++;

          if (count >= 3) {
            count = 0;
            socket.emit("manual", { id: robotID, action: "up" });
          }
          break;
        case 68:
          if (currentKey !== "down") {
            count = 0;
            setCurrentKey("down");
          }

          count++;

          if (count >= 3) {
            count = 0;
            socket.emit("manual", { id: robotID, action: "down" });
          }
          break;
        case 32:
          if (currentKey !== "stop") {
            count = 0;
            setCurrentKey("stop");
          }

          count++;

          if (count >= 3) {
            count = 0;
            socket.emit("manual", { id: robotID, action: "stop" });
          }
          break;
        default:
          console.log("other key");
          break;
      }
      // } else {
      //   swal("Oops!", "You should select a robot first", "error");
      // }
    }
    window.addEventListener("keydown", keyHandling);

    return () => {
      window.removeEventListener("keydown", keyHandling);
    };
  }, [currentKey, robotID]);

  useEffect(() => {
    function keyHandlingUp(e) {
      // if (robotID) {
      switch (e.keyCode) {
        case 37:
          // alert("press arrow left");
          count = 0;
          socket.emit("manual", { id: robotID, action: "left" });

          break;
        case 38:
          // alert("press arrow up");
          count = 0;
          socket.emit("manual", { id: robotID, action: "forward" });
          break;
        case 39:
          // alert("press arrow right");
          count = 0;
          socket.emit("manual", { id: robotID, action: "right" });
          break;
        case 40:
          // alert("press arrow down");
          count = 0;
          socket.emit("manual", { id: robotID, action: "backward" });
          break;
        case 80:
          //press p
          // alert("press arrow down");
          count = 0;
          socket.emit("manual", { id: robotID, action: "up" });
          break;
        case 68:
          count = 0;
          socket.emit("manual", { id: robotID, action: "down" });
          break;
        case 32:
          count = 0;
          socket.emit("manual", { id: robotID, action: "stop" });
          break;
        default:
          console.log("other key");
          break;
      }
      // } else {
      //   swal("Oops!", "You should select a robot first", "error");
      // }
    }
    window.addEventListener("keyup", keyHandlingUp);

    return () => {
      window.removeEventListener("keyup", keyHandlingUp);
    };
  }, [currentKey, robotID]);

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
          socket.emit("manual", { id: robotID, action: "backward" });
          break;
        case "pick":
          socket.emit("manual", { id: robotID, action: "up" });
          break;

        case "drop":
          socket.emit("manual", { id: robotID, action: "down" });
          break;
        case "stop":
          socket.emit("manual", { id: robotID, action: "stop" });
          break;
        default:
      }
    } else {
      console.log("Please choose robot first");
      swal("Oops!", "You should select a robot first", "error");
    }
  }

  function handleChangeMatrix(x, y) {
    var newMatrix = [...JSON.parse(matrix)];
    newMatrix[x][y] = newMatrix[x][y] === 1 ? 0 : 1;

    setMatrix(JSON.stringify(newMatrix));
  }
  function handleAuto() {
    const startX = start.split(",")[0]
    const startY = start.split(",")[1]

    const headX = heading.split(",")[0]
    const headY = heading.split(",")[1]

    socket.emit('auto', {robotID, start: {startX, startY}, end: {headX, headY}})
  }

  return (
    <div className="w-full h-full p-12">
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
      <div className="m-auto w-4/5">
        <Grid container>
          <Grid item xs={12} md={6} className="flex justify-center">
            <div className={classes.matrix}>
              {console.log("a", JSON.parse(matrix))}
              {matrix &&
                JSON.parse(`${matrix}`).map((item, ind) => {
                  return (
                    <div key={ind} className="flex">
                      {item.map((el, index) => {
                        return (
                          <div
                            key={index}
                            style={
                              el === 1
                                ? { background: "#1ea2ff", color: "white" }
                                : {}
                            }
                            onClick={() => handleChangeMatrix(ind, index)}
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
            {/* <img
              alt="camere"
              src={`${host}video_feed`}
              style={{ width: "100%" }}
            /> */}
            <iframe
              title="Camera Streaming"
              style={{ width: 400, height: 300 }}
              src="https://player.twitch.tv/?channel=thanh6198&parent=www.example.com"
            ></iframe>
          </Grid>
        </Grid>
      </div>
      <div className="m-auto w-4/5">
        <Grid container>
          <Grid item xs={12} md={6} className="flex flex-col">
            <div className="flex mt-8 w-full">
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
              {/* <TextField
                className="ml-12"
                label="Starting Point"
                variant="outlined"
                inputProps={{
                  style: { borderColor: "#4299e1", color: "#4299e1" },
                }}
              /> */}
            </div>
            {/* <div className="flex mt-8  w-full">
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
            </div> */}
          </Grid>
          <Grid item xs={12} md={6} className="flex flex-col">
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
                    onClick={() => handleClick("backward")}
                    style={{ background: "#4299e1", color: "#fff" }}
                  >
                    <ArrowDownwardIcon />
                  </Button>
                </div>
                <div className="w-full flex justify-around mt-8">
                  <Button
                    onClick={() => handleClick("up")}
                    variant="contained"
                    style={{
                      background: "#4299e1",
                      color: "#fff",
                    }}
                  >
                    Pick
                  </Button>
                  <Button
                    onClick={() => handleClick("stop")}
                    variant="contained"
                    style={{
                      background: "#4299e1",
                      color: "#fff",
                    }}
                  >
                    Stop
                  </Button>
                  <Button
                    onClick={() => handleClick("down")}
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
                  onChange={e => setStart(e.target.value)}
                  value={start}
                  inputProps={{
                    style: { borderColor: "#4299e1", color: "#4299e1" },
                  }}
                />
                <TextField
                  label="Heading Point"
                  variant="outlined"
                  value={heading}
                  onChange={e => setHeading(e.target.value)}
                  inputProps={{
                    style: { borderColor: "#4299e1", color: "#4299e1" },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAuto}
                  style={{ background: "#4299e1", color: "#fff" }}
                >
                  Start
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default App;
