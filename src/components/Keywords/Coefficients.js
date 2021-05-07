import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { FormControl, TextField } from "@material-ui/core";

// Styles for label
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
    },
    margin: {
        margin: theme.spacing(1),
    },
    textField: {
        width: "15ch",
    },
}));

const Coefficients = ({
    DA,
    setDA,
    PA,
    setPA,
    CF,
    setCF,
    TF,
    setTF,
    LINKS,
    setLINKS,
    FB,
    setFB,
    LPS,
    setLPS,
}) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div>
                <h2>Change Coefficients here:</h2>
            </div>
            <div>
                <FormControl>
                    <TextField
                        label='Domain Authority'
                        className={clsx(classes.margin, classes.textField)}
                        variant='outlined'
                        value={DA}
                        onChange={(e) => setDA(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label='Page Authority'
                        className={clsx(classes.margin, classes.textField)}
                        variant='outlined'
                        value={PA}
                        onChange={(e) => setPA(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label='Citation Flow'
                        className={clsx(classes.margin, classes.textField)}
                        variant='outlined'
                        value={CF}
                        onChange={(e) => setCF(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label='Trust Flow'
                        className={clsx(classes.margin, classes.textField)}
                        variant='outlined'
                        value={TF}
                        onChange={(e) => setTF(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label='Links'
                        className={clsx(classes.margin, classes.textField)}
                        variant='outlined'
                        value={LINKS}
                        onChange={(e) => setLINKS(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label='Facebook Shares'
                        className={clsx(classes.margin, classes.textField)}
                        variant='outlined'
                        value={FB}
                        onChange={(e) => setFB(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label='Mangools LPS'
                        className={clsx(classes.margin, classes.textField)}
                        variant='outlined'
                        value={LPS}
                        onChange={(e) => setLPS(e.target.value)}
                    />
                </FormControl>
            </div>
        </div>
    );
};

export default Coefficients;
