import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import GoogleButton from "react-google-button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  helperFunction_googleSignin,
  helperFunction_registerNewUser,
  helperFunction_userHandleIsUnique,
} from "../helperFunctions";
import { redux_addUser, startLoading, stopLoading } from "../redux/actions";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.User);
  const loading = useSelector((state) => state.Generic.Loading);

  const [userHandle, setUserHandle] = useState("");
  const [initialValue, setInitialValue] = useState({
    userName: "",
    userHandle: "",
    userEmail: "",
    userPassword: "",
    confirmUserPassword: "",
  });

  const backToLogin = () => {
    navigate(-1);
  };

  const handleGoogleSignin = () => {
    startLoading(dispatch);
    helperFunction_googleSignin(dispatch)
      .then(() => {
        navigate("/");
      })
      .catch(() => console.log("error"))
      .finally(() => {
        stopLoading(dispatch);
      });
  };

  const handleSignup = (values) => {
    startLoading(dispatch);
    helperFunction_userHandleIsUnique(values.userHandle)
      .then((isUnique) => {
        console.log(isUnique);
        if (isUnique) {
          startLoading(dispatch);
          helperFunction_registerNewUser(dispatch, values)
            .then((res) => {
              navigate("/");
            })
            .catch((errorData) => {
              // alert("Registration Failed");
              alert(errorData.errorCode.split('/')[1])
              console.log(errorData);
            })
            .finally(() => {
              stopLoading(dispatch);
            });
        } else {
          alert("This userHandle is already taken, try some other one. :)");
        }
      })
      .finally(() => {
        stopLoading(dispatch);
      });
      setInitialValue(values)
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate(`../user/${userId}`);
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
        flexDirection: "column",
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

      <Box
        style={{
          marginTop: "9rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {!loading ? (
          <>
            <GoogleButton
              disabled={loading}
              onClick={() => {
                handleGoogleSignin();
              }}
            />
            <span>OR</span>
            <hr style={{ border: "1px solid black", width: "70%" }} />
            <br />
            <Formik
              initialValues={initialValue}
              onSubmit={async (values) => {
                handleSignup(values);
                // const isUnique = await varifyUserHandle(values.userHandle);
                // if (!isUnique) {
                //   alert("This userHandle is already taken, try some other one. :)");
                //   return;
                // }
                // startLoading(dispatch);
                // helperFunction_registerNewUser(dispatch, values)
                //   .then((res) => {
                //     navigate("/");
                //   })
                //   .catch((errorData) => {
                //     alert("Registration Failed");
                //     console.log(errorData);
                //   })
                //   .finally(() => {
                //     stopLoading(dispatch);
                //   });
              }}
              validate={(values) => {
                Object.keys(values).forEach((key) => {
                  values[key] = values[key].trim();
                });
                setUserHandle(values.userHandle.trim());

                let errors = {};
                if (!values.userEmail) errors["userEmail"] = "Required";
                if (!values.userPassword) errors["userPassword"] = "Required";
                if (!values.userName) errors["userName"] = "Required";
                if (!values.confirmUserPassword)
                  errors["confirmUserPassword"] = "Required";
                if (!values.userHandle) errors["userHandle"] = "Required";

                if (
                  values.userPassword.toLocaleLowerCase() !=
                  values.confirmUserPassword.toLocaleLowerCase()
                )
                  errors["confirmUserPassword"] = "Must be same as Password";

                if (!values.userEmail.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))
                  errors["userEmail"] = "Enter valid email address!";

                if (
                  !helperFunction_userHandleIsUnique(
                    dispatch,
                    values.userHandle
                  )
                )
                  errors["userHandle"] = "This handle is already taken!";

                return errors;
              }}
            >
              {({ values, errors }) => (
                <Form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "70%",
                    marginLeft: "-30px",
                  }}
                >
                  <div
                    style={
                      Object.keys(errors).includes("userName")
                        ? {
                            border: "1px solid red",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                            padding: "0px 15px 10px 10px",
                          }
                        : {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                            padding: "1px 16px 11px 11px",
                          }
                    }
                  >
                    <label
                      htmlFor="userName"
                      style={
                        Object.keys(errors).includes("userName")
                          ? { color: "red" }
                          : {}
                      }
                    >
                      User Name
                    </label>
                    <Field
                      type="text"
                      name={"userName"}
                      id={"userName"}
                      style={{
                        width: "100%",
                        padding: " 5px",
                        fontWeight: "800",
                        fontSize: "15px",
                      }}
                    />
                  </div>
                  <hr />

                  <div
                    style={
                      Object.keys(errors).includes("userHandle")
                        ? {
                            border: "1px solid red",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                            padding: "0px 15px 10px 10px",
                          }
                        : {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                            padding: "1px 16px 11px 11px",
                          }
                    }
                  >
                    <label
                      htmlFor="userHandle"
                      style={
                        Object.keys(errors).includes("userHandle")
                          ? { color: "red" }
                          : {}
                      }
                    >
                      User Handle
                    </label>
                    <Field
                      type="text"
                      name={"userHandle"}
                      value={userHandle}
                      id={"userHandle"}
                      style={{
                        width: "100%",
                        padding: " 5px",
                        fontWeight: "800",
                        fontSize: "15px",
                      }}
                    />
                  </div>
                  <hr />

                  <div
                    style={
                      Object.keys(errors).includes("userEmail")
                        ? {
                            border: "1px solid red",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                            padding: "0px 15px 10px 10px",
                          }
                        : {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                            padding: "1px 16px 11px 11px",
                          }
                    }
                  >
                    <label
                      htmlFor="userEmail"
                      style={
                        Object.keys(errors).includes("userEmail")
                          ? { color: "red" }
                          : {}
                      }
                    >
                      User Email
                    </label>
                    <Field
                      type="email"
                      name={"userEmail"}
                      id={"userEmail"}
                      style={{
                        width: "100%",
                        padding: " 5px",
                        fontWeight: "800",
                        fontSize: "15px",
                      }}
                    />
                  </div>
                  <hr />

                  <div
                    style={
                      Object.keys(errors).includes("userPassword")
                        ? {
                            border: "1px solid red",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                            padding: "0px 15px 10px 10px",
                          }
                        : {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                            padding: "1px 16px 11px 11px",
                          }
                    }
                  >
                    <label
                      htmlFor="userPassword"
                      style={
                        Object.keys(errors).includes("userPassword")
                          ? { color: "red" }
                          : {}
                      }
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      name={"userPassword"}
                      id={"userPassword"}
                      style={{
                        width: "100%",
                        padding: " 5px",
                        fontWeight: "800",
                        fontSize: "15px",
                      }}
                    />
                  </div>
                  <hr />
                  <div
                    style={
                      Object.keys(errors).includes("confirmUserPassword")
                        ? {
                            border: "1px solid red",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                            padding: "0px 15px 10px 10px",
                          }
                        : {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                            padding: "1px 16px 11px 11px",
                          }
                    }
                  >
                    <label
                      htmlFor="confirmUserPassword"
                      style={
                        Object.keys(errors).includes("confirmUserPassword")
                          ? { color: "red" }
                          : {}
                      }
                    >
                      Confirm Password
                    </label>
                    <Field
                      type="password"
                      name={"confirmUserPassword"}
                      id={"confirmUserPassword"}
                      style={{
                        width: "100%",
                        padding: " 5px",
                        fontWeight: "800",
                        fontSize: "15px",
                      }}
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    Register
                  </Button>
                  <Button type="button" onClick={() => backToLogin()}>
                    Back To Login
                  </Button>
                </Form>
              )}
            </Formik>
          </>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Box>
  );
}

export default Signup;
