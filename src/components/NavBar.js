import React, { useContext } from "react";
import UserContext from "../context/UserContext";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Button } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        fontWeight: 600,
    },
}));

const NavBar = () => {
    const { user } = useContext(UserContext);
    const classes = useStyles();

    return (
        <div>
            <AppBar position='static'>
                <Toolbar>
                    <Link to='/app'>
                        <Button className={classes.title}>MediaOne</Button>
                    </Link>
                    {user ? (
                        <>
                            <Link to='/app/keyword-timeline-analysis'>
                                <Button className={classes.title}>
                                    Keyword Timeline Analysis
                                </Button>
                            </Link>
                        </>
                    ) : (
                        ""
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default NavBar;
