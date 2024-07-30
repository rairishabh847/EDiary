import { ArrowBack, ContentCopyOutlined } from "@mui/icons-material";
import {
  AppBar,
  CircularProgress,
  IconButton,
  Snackbar,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { api_getNoteByNoteId } from "../endPoints";
import { helperFunction_getNoteData } from "../helperFunctions";
import { redux_addNotes, startLoading, stopLoading } from "../redux/actions";

function Note() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.Generic.Loading);
  const allNotes = useSelector((state) => state.Notes);
  const [noteData, setNoteData] = useState({});

  // for copy to clipboard button
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
    navigator.clipboard
      .writeText(noteData.noteText)
      .then(() => console.log("successfully copied"))
      .catch(() => console.log("failed to copy"));
  };

  useEffect(() => {
    if (allNotes.length) {
      helperFunction_getNoteData(allNotes, noteId)
        .then((noteData) => {
          setNoteData(noteData);
        })
        .catch((errorData) => {
          console.log(errorData);
        });
    } else {
      const userId = localStorage.getItem("userId");
      api_getNoteByNoteId(noteId, userId)
        .then((noteData) => {
          setNoteData(noteData);
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
              onClick={() => {
                navigate("/");
              }}
            >
              The E-Diary App
            </Typography>
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
            }}
          >
            <Typography variant="h4">{noteData.noteName}</Typography>

            <>
              <IconButton
                onClick={handleClick}
                color="primary"
                style={{
                  position: "absolute",
                  // right: "10%",
                  // top: "22%",
                  cursor: "pointer",
                }}
                sx={{
                  top: { xs: "16%", md: "22%" },
                  right: { xs: "2%", md: "10%" },
                }}
              >
                <ContentCopyOutlined
                // onClick={() => handleCopyToClipboard(noteData.noteText)}
                />
              </IconButton>
              <Snackbar
                message="Copied to clibboard"
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                open={open}
              />
            </>
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
            value={noteData.noteText}
            readOnly
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
            <ArrowBack
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate(-1);
              }}
            />
            <Typography>
              Last Modified :{" "}
              {noteData.updateDate
                ? new Date(noteData.updateDate).toLocaleString() ==
                  "Invalid Date"
                  ? noteData.updateDate.toDate().toLocaleString()
                  : new Date(noteData.updateDate).toLocaleString()
                : noteData.createDate
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

export default Note;
