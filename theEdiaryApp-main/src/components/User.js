import { AddCircleOutlineOutlined } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  helperFunction_getAllHisPrivateNotes,
  helperFunction_getUserByUserId,
} from "../helperFunctions";
import { redux_addUser, stopLoading } from "../redux/actions";
import Chicklet from "./Chicklet";
import ProtectedNavbar from "./ProtectedNavbar";
function User() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchText = useSelector((state) => state.Generic.searchText);
  const loading = useSelector((state) => state.Generic.Loading);
  const [allNotes, setAllNotes] = useState([]);
  const [notesToShow, setNotesToShow] = useState([]);
  const allNotes_redux = useSelector((state) => state.Notes);
  const user = useSelector((state) => state.User);

  const [errorMessage, setErrorMessage] = useState(null);
  const [showPrivateNotes, setShowPrivateNotes] = useState(false);
  const [showPublicNotes, setShowPublicNotes] = useState(false);
  const selectedColor = "#35baf6";
  // const selectedColor = "#1976d2";

  const handleClick_all = () => {
    setShowPublicNotes(false);
    setShowPrivateNotes(false);
    console.log(" show alll his/her notes");
    setNotesToShow(allNotes);
  };
  const handleClick_public = () => {
    setShowPublicNotes(true);
    setShowPrivateNotes(false);
    // filter notes
    let temp = [];
    allNotes.forEach((note) => {
      if (note.isPublic) temp.push(note);
    });
    setNotesToShow(temp);
  };
  const handleClick_private = () => {
    setShowPrivateNotes(true);
    setShowPublicNotes(false);
    // filter notes
    let temp = [];
    allNotes.forEach((note) => {
      if (!note.isPublic) temp.push(note);
    });
    console.log(allNotes, temp);
    setNotesToShow(temp);
  };

  useEffect(() => {
    const func = () => {
      if (!showPublicNotes && !showPrivateNotes) {
        setNotesToShow(allNotes);
        return allNotes;
      } else if (showPublicNotes) {
        let temp = [];
        allNotes.forEach((note) => {
          if (note.isPublic) temp.push(note);
        });

        setNotesToShow(temp);
        return temp;
      } else {
        let temp = [];
        allNotes.forEach((note) => {
          if (!note.isPublic) temp.push(note);
        });
        setNotesToShow(temp);
        return temp;
      }
    };
    // logic for searching and displaying
    if (searchText.length) {
      // search in allNotes_redux and update the allNotes
      let potentialOutput = [];

      const returnValue = func();
      returnValue.forEach((note) => {
        if (note.noteName.toLowerCase().includes(searchText)) {
          potentialOutput.push(note);
        }
      });
      console.log("your search result", potentialOutput);
      setNotesToShow(potentialOutput);
    } else {
      func();
    }
  }, [searchText, showPublicNotes, showPrivateNotes]);

  useEffect(() => {
    let temp = [];
    const userId = localStorage.getItem("userId");
    if (allNotes_redux.length) {
      allNotes_redux.forEach((note) => {
        if (note.userId === userId) temp.push(note);
      });
    }
    setAllNotes(temp);
    setNotesToShow(temp);
  }, [allNotes_redux]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      if (!user) {
        helperFunction_getUserByUserId(dispatch, userId)
          .then((data) => {
            helperFunction_getAllHisPrivateNotes(dispatch, userId).then(
              (data) => {
                console.log("Successfully fetched userData");
                stopLoading(dispatch);
              }
            );
          })
          .catch((errorData) => {
            setErrorMessage("You are offline");
            alert("You are offline :)");
            console.log(errorData);
          });
      }
    } else navigate("/");
  }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <ProtectedNavbar />
        <AppBar sx={{ marginTop: 7 }}>
          <Toolbar>
            <Button
              onClick={() => handleClick_all()}
              variant="contained"
              sx={{
                flexGrow: 1,
                backgroundColor:
                  !showPrivateNotes && !showPublicNotes ? selectedColor : "",
              }}
            >
              All
            </Button>
            <Button
              onClick={() => handleClick_public()}
              variant="contained"
              sx={{
                flexGrow: 1,
                backgroundColor: showPublicNotes ? selectedColor : "",
              }}
            >
              Public
            </Button>
            <Button
              onClick={() => handleClick_private()}
              variant="contained"
              sx={{
                flexGrow: 1,
                backgroundColor: showPrivateNotes ? selectedColor : "",
              }}
            >
              Private
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      <Box
        sx={{
          display: { xs: "flex", sm: "flex" },
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          height: "100%",
          padding: 2,
          marginTop: 14,
          backgroundColor: "floralwhite",
        }}
      >
        {notesToShow && notesToShow.length ? (
          notesToShow.map((note, index) => (
            <Chicklet
              key={index}
              index={index}
              noteName={note.noteName}
              noteText={note.noteText}
              noteId={note.id}
              noteData={note}
            />
          ))
        ) : loading ? (
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "70vh",
            }}
          >
            <CircularProgress disableShrink />
          </Box>
        ) : errorMessage ? (
          errorMessage
        ) : (
          "You haven't added any note so far ..."
        )}
        <AddCircleOutlineOutlined
          style={{
            position: "fixed",
            right: "2%",
            bottom: "5%",
            height: "5rem",
            width: "5rem",
            cursor: "pointer",
          }}
          onClick={() => {
            navigate("/newNote");
          }}
        />
      </Box>
    </>
  );
}

export default User;
