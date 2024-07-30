import { AddCircleOutlineOutlined } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllNotesAPI } from "../endPoints";
import { redux_addNotes, startLoading, stopLoading } from "../redux/actions";
import Chicklet from "./Chicklet";
import Navbar from "./Navbar";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchText = useSelector((state) => state.Generic.searchText);
  const loading = useSelector((state) => state.Generic.Loading);
  const [allNotes, setAllNotes] = useState([]);
  const allNotes_redux = useSelector((state) => state.Notes);

  useEffect(() => {
    // logic for searching and displaying
    if (searchText.length) {
      // search in allNotes_redux and update the allNotes
      let potentialOutput = [];
      allNotes_redux.forEach((note) => {
        if (note.noteName.toLowerCase().includes(searchText)) {
          potentialOutput.push(note);
        }
      });
      console.log("your search result", potentialOutput);
      setAllNotes(potentialOutput);
    } else {
      setAllNotes(allNotes_redux);
    }
  }, [searchText]);

  // useEffect(() => {
  //   if (!allNotes_redux.length) {
  //     setTimeout(async () => {
  //       startLoading(dispatch);
  //       const returnValue = await getAllNotesAPI();
  //       console.log("fetched");
  //       stopLoading(dispatch);
  //       setNotes_redux(dispatch, returnValue.allNotes);
  //       setAllNotes(returnValue.allNotes);
  //     }, 1000);
  //   } else {
  //     setAllNotes(allNotes_redux);
  //   }
  // }, []);

  useEffect(() => {
    setAllNotes(allNotes_redux);
  }, [allNotes_redux]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: { xs: "flex", sm: "flex" },
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          height: "100%",
          padding: 2,
          marginTop: 7,
          backgroundColor: "floralwhite",
        }}
      >
        {allNotes && allNotes.length ? (
          allNotes.map((note, index) => (
            (note.isPublic) &&
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
        ) : (
          "Check your Network"
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

export default Home;
