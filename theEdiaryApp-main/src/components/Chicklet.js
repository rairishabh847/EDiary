import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DeleteForever, Edit } from "@mui/icons-material";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../database";
import { useDispatch, useSelector } from "react-redux";
import { redux_removeOneNote } from "../redux/actions";

export default function Chicklet(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state=>state.User)

  const handleDelete = async (index) => {
    const password = prompt("Enter the password (case sensitive)");
    if (password)
      if (password == process.env.REACT_APP_DELETION_PASSWORD) {
        // logic to delete this note.
        const returnValue = await deleteDoc(
          doc(db, "notes", props.noteData.id)
        );
        redux_removeOneNote(dispatch, props.noteData.id);
        console.log(
          `successfully deleted : ${props.noteData.id} - ${props.noteName}`
        );
      } else console.log(`wrong password`);
  };

  const handleEdit = (index) => {
    navigate(`../edit/note/${props.noteId}`);
    console.log("Editing " + props.noteName);
  };

  return (
    <Card sx={{ minWidth: 275, minHeight: 180, maxHeight: 200, margin: 1 }}>
      <CardActionArea
        sx={{}}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          boxSizing: "border-box",
        }}
      >
        {(user && user.id === props.noteData.userId ) && false &&
        <DeleteForever
          // sx={{height:20}}
          style={{
            position: "absolute",
            right: "1%",
            top: "1%",
            // border: "1px solid black",
            // backgroundColor: "#80808026",
            // "&::-webkit-hover": { backgroundColor: "red", display:"none" },
          }}
          onClick={() => handleDelete(props.index)}
        />}
        {(user && user.id === props.noteData.userId ) &&
          <Edit
          // sx={{height:20}}
          style={{
            position: "absolute",
            right: "15%",
            top: "1%",
            // border: "1px solid black",
          }}
          onClick={() => handleEdit(props.index)}
        />}

        <br />

        <CardContent
          onClick={() => {
            navigate(`/note/${props.noteId}`);
          }}
          style={{
            width: "90%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography
            component="h1"
            sx={{ fontWeight: "900", fontSize: 24 }}
            style={{ backgroundColor: "#80808026" }}
          >
            {props.noteName ? props.noteName : "Note Name"}
          </Typography>

          <br />

          <Box sx={{ display: "flex" }}>
            <Box sx={{ flex: 0.5 }}>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.primary"
                gutterBottom
              >
                {props.noteData.createDate
                  ? new Date(props.noteData.createDate).toLocaleString() ==
                    "Invalid Date"
                    ? props.noteData.createDate.toDate().toLocaleString()
                    : new Date(props.noteData.createDate).toLocaleString()
                  : "13 Jan 2023"}
              </Typography>
            </Box>
            <Box sx={{ flex: 0.5 }}>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                @
                {props.noteData.userName
                  ? props.noteData.userName
                  : "Default User"}
              </Typography>
            </Box>
          </Box>

          <br />

          <Typography
            sx={{ fontSize: 14 }}
            color="text.secondary"
            gutterBottom
            // style={{ backgroundColor: "#80808026" }}
          >
            {props.noteText
              ? `${props.noteText.slice(0, 25)}....`
              : "Word of the Day"}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
