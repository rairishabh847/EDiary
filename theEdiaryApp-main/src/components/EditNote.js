import {
  AccountCircle,
  ArrowBack,
  ContentCopyOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Button,
  CircularProgress,
  IconButton,
  Input,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import { serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { api_getNoteByNoteId } from "../endPoints";
import {
  helperFunction_getNoteData,
  helperFunction_updateOneNote,
} from "../helperFunctions";
import { redux_addNotes, startLoading, stopLoading } from "../redux/actions";

function EditNote() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.Generic.Loading);
  const allNotes = useSelector((state) => state.Notes);
  const user = useSelector((state) => state.User);
  const [noteData, setNoteData] = useState({});
  const [userInput, setUserInput] = useState();
  const [isPublic, setIsPublic] = useState(true);

  const handleExit = () => {
    if (!userInput.trim()) {
      navigate(-1);
    } else {
      if (window.confirm("Are you sure to discard all the changes?"))
        navigate(-1);
      else console.log("continue");
    }
  };

  const handleUpdate = () => {
    if (userInput.trim()) {
      noteData.updateDate = serverTimestamp();
      noteData.noteText = userInput;
      noteData.isPublic = isPublic;
      helperFunction_updateOneNote(dispatch, noteData)
        .then(() => {
          navigate(-1);
        })
        .catch((errorData) => {
          console.log(errorData);
        });
    } else {
      console.log("Provide valid values");
    }
  };

  const getVisibility = (selection = "Public") => {
    console.log(selection);
    setIsPublic(selection === "Public" ? true : false);
  };

  useEffect(() => {
    if (allNotes.length) {
      helperFunction_getNoteData(allNotes, noteId)
        .then((noteData) => {
          setNoteData(noteData);
          setUserInput(noteData.noteText);
        })
        .catch((errorData) => {
          console.log(errorData);
        });
    } else {
      const userId = localStorage.getItem("userId");
      api_getNoteByNoteId(noteId, userId)
        .then((noteData) => {
          setNoteData(noteData);
          setUserInput(noteData.noteText);
        })
        .catch((errorData) => {
          console.log(errorData);
        });
    }
  }, []);

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
              // onClick={() => {
              //   navigate("/");
              // }}
            >
              The E-Diary App
            </Typography>
            {user ? <AccountCircle /> : ""}
          </Toolbar>
        </Container>
      </AppBar>

      {Object.keys(noteData).length ? (
        <Box
          style={{
            // border: "1px solid red",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "80vw",
            marginTop: "5rem",
          }}
          sx={{ fontSize: { xs: 10, md: 28 } }}
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
              {/* <Input
                placeholder="Name"
                value={noteData.noteName}
                sx={{ minWidth: { xs: 200, sm: 500 } }}
                
                /> */}
              <Typography sx={{ minWidth: { xs: 200, sm: 500 } }} variant="h4">
                {noteData.noteName}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                flex: "0.2",
                justifyContent: "start",
                width: "100px",
              }}
            >
              <Button
                type="submit"
                sx={{ color: "success" }}
                onClick={() => {
                  handleUpdate();
                }}
              >
                Update
              </Button>
            </Box>
          </Box>
          <Box
            style={{
              display: "flex",
              flex: "0.2",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <VisibilityToggleButton
              getVisibility={getVisibility}
              isPublic={noteData.isPublic}
            />
          </Box>
          <textarea
            type="text"
            rows="30"
            cols="14"
            style={{
              resize: "none",
              padding: "5px",
              fontSize: 18,
              height: "70vh",
            }}
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
          />
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              padding: "5px",
              marginTop: "5px",
            }}
          >
            {/* <ArrowBack
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate(-1);
              }}
            /> */}
            <Typography>
              Last Modified :{" "}
              {noteData.createDate
                ? new Date(noteData.createDate).toLocaleString() ==
                  "Invalid Date"
                  ? noteData.createDate.toDate().toLocaleString()
                  : new Date(noteData.createDate).toLocaleString()
                : "10 / 01 / 2023"}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh",
          }}
        >
          {loading ? (
            <CircularProgress disableShrink />
          ) : (
            "No such Note exists 😶!!"
          )}
        </Box>
      )}
    </Box>
  );
}

export default EditNote;

// toggle btn
function VisibilityToggleButton({ getVisibility, isPublic }) {
  const [alignment, setAlignment] = useState(isPublic ? "Public" : "Private");
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
