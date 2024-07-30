import {
  AccountCircle,
  ArrowBack,
  HelpOutline,
  Login,
} from "@mui/icons-material";
import {
  AppBar,
  Button,
  Input,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import { FieldValue, serverTimestamp } from "firebase/firestore";
import PopupState from "material-ui-popup-state";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import {
  helperFunction_addOneNote,
  helperFunction_userLogout,
} from "../helperFunctions";
import { redux_addOneNote } from "../redux/actions";
import { Menu, MenuItem } from "@mui/material";
import { bindTrigger, bindMenu } from "material-ui-popup-state";
import { moveData } from "../endPoints";

function NewNote() {
  const user = useSelector((state) => state.User);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [noteName, setNoteName] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleExit = () => {
    if (!userInput.trim()) {
      navigate(-1);
    } else {
      if (window.confirm("Are you sure to discard all the changes?"))
        navigate(-1);
      else console.log("continue");
    }
  };

  const handleSave = async () => {
    if (noteName.trim() && userInput.trim()) {
      const noteData = {
        id: v4(),
        createDate: serverTimestamp(),
        noteText: userInput,
        userHandle: user ? user.userHandle : "defaultPublicUser",
        noteName: noteName.trim(),
        userName: user ? user.userName : "Default Public User",
        userId: user ? user.id : "IOv7coi4DhQMMBbtbNWOmcJ6E6d2",
        isPublic,
      };
      helperFunction_addOneNote(dispatch, noteData)
        .then(() => {
          navigate(-1);
        })
        .catch((errorData) => {
          alert(errorData);
          console.log(errorData);
        });
    } else {
      alert("Provide valid values");
      console.log("Provide valid values");
    }
  };

  const getVisibility = (selection = "Public") => {
    console.log(selection);
    setIsPublic(selection === "Public" ? true : false);
  };

  const handleLogout = async (popupState) => {
    popupState.close();
    helperFunction_userLogout(dispatch)
      .then(() => {
        console.log("Successfully logged out");
      })
      .catch((errorData) => {
        console.log(errorData);
      });
  };

  const handleNavigation = (popupState) => {
    popupState.close();
    // navigate(`/user/${user.id}`);
    navigate(-1);
  };

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h5"
              noWrap
              component="span"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "flex" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/");
              }}
            >
              The E-Diary App
            </Typography>
            <Box
              sx={{
                width: { xs: 70, md: 100, lg: 70 },
                display: { xs: "flex", sm: "flex" },
                justifyContent: "flex-end",
                cursor: "pointer",
              }}
            >
              {user ? (
                // <AccountCircle
                //   onClick={() => {
                //     navigate(`/user/${user.userId}`);
                //   }}
                // />

                <PopupState variant="popover" popupId="demo-popup-menu">
                  {(popupState) => (
                    <React.Fragment>
                      <AccountCircle
                        variant="contained"
                        {...bindTrigger(popupState)}
                      />
                      <Menu {...bindMenu(popupState)}>
                        {/* <MenuItem onClick={popupState.close}>Profile</MenuItem> */}
                        <MenuItem
                          onClick={() => {
                            handleNavigation(popupState);
                          }}
                        >
                          {user.userName}
                        </MenuItem>
                        <hr />
                        <MenuItem
                          onClick={() => {
                            handleLogout(popupState);
                          }}
                        >
                          Logout
                        </MenuItem>
                      </Menu>
                    </React.Fragment>
                  )}
                </PopupState>
              ) : (
                <Login
                  onClick={() => {
                    navigate("/login");
                  }}
                />
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "90vw",
          marginTop: "5rem",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
            width: "inherit",
          }}
        >
          <Box
            style={{
              display: "flex",
              flex: "0.2",
              justifyContent: "start",
              width: "100px",
            }}
          >
            <ArrowBack
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleExit();
              }}
            />
          </Box>
          <Box
            style={{ display: "flex", flex: "0.6", justifyContent: "center" }}
          >
            <Input
              placeholder="Name"
              value={noteName}
              sx={{ minWidth: { xs: 200, sm: 500 } }}
              onChange={(e) => {
                setNoteName(e.target.value);
              }}
            />
            <Button
              type="submit"
              sx={{}}
              onClick={() => {
                handleSave();
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {/* <HelpOutline style={{ cursor: "pointer" }} /> */}
          <VisibilityToggleButton getVisibility={getVisibility} />
        </Box>
        <textarea
          type="text"
          placeholder="Your Text Note goes here..."
          rows="30"
          cols="14"
          style={{
            resize: "none",
            padding: "5px",
            fontSize: 18,
            height: "70vh",
            width: "90vw",
          }}
          onChange={(e) => {
            handleChange(e);
          }}
          value={userInput}
        />
      </Box>
    </Box>
  );
}

// toggle btn
function VisibilityToggleButton({ getVisibility }) {
  const [alignment, setAlignment] = useState("Public");
  const user = useSelector((state) => state.User);

  const handleChange = (event, newAlignment) => {
    // check if authorised to create a private note or not
    if (!user && newAlignment === "Private") {
      alert("Signin to create private notes");
    } else if (newAlignment != null) {
      setAlignment(newAlignment);
      getVisibility(newAlignment);
    }
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value="Public">Public</ToggleButton>
      <ToggleButton value="Private">Private</ToggleButton>
    </ToggleButtonGroup>
  );
}

export default NewNote;
