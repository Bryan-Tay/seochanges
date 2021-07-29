import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  logo: {
    fontWeight: 800,
  },
  nav: {
    flexGrow: 1,
    marginLeft: theme.spacing(4),
  },
  link: {
    color: "#363636",
    fontWeight: 600,
    textDecoration: "none",
  },
}));

const NavBar = () => {
  const classes = useStyles();
  const { logout } = useAuth();
  const { replace } = useHistory();

  const handleLogout = async () => {
    await logout();
    await replace("/app");
  };

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Link to="/app" className={classes.link}>
          <Typography
            noWrap
            variant="h6"
            color="inherit"
            className={classes.logo}
          >
            MediaOne
          </Typography>
        </Link>
        <nav className={classes.nav}>
          <Link to="/app/keyword-timeline-analysis" className={classes.link}>
            Keyword Timeline Analysis
          </Link>
        </nav>
        <Button
          size="small"
          color="secondary"
          variant="contained"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
