import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  makeStyles,
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
  helperFunction_loginExistingUser,
} from "../helperFunctions";
import { redux_addUser, startLoading, stopLoading } from "../redux/actions";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.Generic.Loading);
  const [initialValue, setInitialValue] = useState({
    userEmail: "",
    userPassword: "",
  });

  const gotoSignup = () => {
    navigate("../signup");
  };

  const handleGoogleSignin = () => {
    startLoading(dispatch);
    helperFunction_googleSignin(dispatch)
      .then((userId) => {
        // navigate("/");
        navigate(`../user/${userId}`);
      })
      .catch(() => console.log("error"))
      .finally(() => {
        stopLoading(dispatch);
      });
  };

  const handleLogin = (values) => {
    startLoading(dispatch);
    helperFunction_loginExistingUser(dispatch, values)
      .then((res) => {
        navigate("/");
      })
      .catch((errorData) => {
        // alert("Sign-In failed");
        alert(errorData.errorCode.split("/")[1]);
        console.log(errorData);
      })
      .finally(() => {
        stopLoading(dispatch);
      });
    setInitialValue(values);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      console.log("from useEffect");
      stopLoading(dispatch);
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
              onSubmit={(values) => {
                handleLogin(values);
                // startLoading(dispatch);
                // helperFunction_loginExistingUser(dispatch, values)
                //   .then((res) => {
                //     navigate("/");
                //   })
                //   .catch((errorData) => {
                //     alert("Sign-In failed");
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

                let errors = {};
                if (!values.userEmail) errors["userEmail"] = "Required";
                if (!values.userPassword) errors["userPassword"] = "Required";

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
                      type="text"
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

                  <br />

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

                  <br />
                  <Button disabled={loading} type="submit">
                    Login
                  </Button>
                  <Button
                    disabled={loading}
                    type="button"
                    onClick={() => gotoSignup()}
                  >
                    Create new account
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

export default Login;
