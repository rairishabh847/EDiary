import "./App.css";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Note from "./components/Note";
import NewNote from "./components/NewNote";
import { useEffect, useState } from "react";
import {
  redux_addNotes,
  redux_addUser,
  startLoading,
  stopLoading,
} from "./redux/actions";
import { useDispatch, useSelector } from "react-redux";
import User from "./components/User";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { api_getUserByUserId } from "./endPoints";
import { helperFunction_getAllPublicNotes } from "./helperFunctions";
import EditNote from "./components/EditNote";

function App() {
  const dispatch = useDispatch();
  const [allNotes, setAllNotes] = useState([]);
  const allNotes_redux = useSelector((state) => state.Notes);

  useEffect(() => {
    startLoading(dispatch);
    // connectToFirebase();

    if (!allNotes_redux.length) {
      setTimeout(async () => {
        startLoading(dispatch);
        helperFunction_getAllPublicNotes(dispatch)
          .then((data) => {
            console.log("fetched");
            setAllNotes(data);
          })
          .catch((errorData) => {
            console.log(errorData);
          })
          .finally(() => {
            stopLoading(dispatch);
          });
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const func = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        // fetch the user's data but no redirection
        console.log("fetching the user");
        // const userData = await getUserByUserId(userId);
        api_getUserByUserId(userId)
          .then((userData) => {
            if (Object.keys(userData).length) redux_addUser(dispatch, userData);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };
    func();
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/note/:noteId" element={<Note />} />
          <Route path="/edit/note/:noteId" element={<EditNote />} />
          <Route path="/newNote" element={<NewNote />} />
          <Route path="/user/:userId" element={<User />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
