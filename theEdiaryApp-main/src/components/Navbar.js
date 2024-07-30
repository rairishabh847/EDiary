import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { AccountCircle, Login } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setSearchText_redux } from "../redux/actions";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { helperFunction_userLogout } from "../helperFunctions";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function Navbar() {
  const [searchText, setSearchText] = React.useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.User);

  const handleChange = (e) => {
    if (e.target.value.trim() || true) {
      setSearchText(e.target.value.trim().toLowerCase());
      setSearchText_redux(dispatch, e.target.value.trim().toLowerCase());
    }
    // else {
    //   setSearchText(e.target.value);
    //   console.log("no change in searchText");
    // }
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
    navigate(`/user/${user.id}`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          {/* desktop view */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: "left",
              display: { xs: "none", sm: "block" },
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            The E-Diary App
          </Typography>

          {/* mobile view */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              width: 100,
              display: { xs: "block", sm: "none" },
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            E-Diary
          </Typography>

          <Search sx={{ flexGrow: 1 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={searchText}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </Search>

          <Box
            sx={{
              width: { xs: 70, md: 300, lg: 400 },
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
                      <MenuItem onClick={popupState.close}>{user.userName}</MenuItem>
                      <hr/>
                      <MenuItem
                        onClick={() => {
                          handleNavigation(popupState);
                        }}
                      >
                        My Notes
                      </MenuItem>
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
      </AppBar>
    </Box>
  );
}
