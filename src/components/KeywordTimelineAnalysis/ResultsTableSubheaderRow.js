import { makeStyles, TableCell, TableRow } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  row: {
    backgroundColor: "#ececec",
  },
  title: {
    fontSize: "1rem",
    fontWeight: "bold",
    lineHeight: "3rem",
    paddingLeft: "1rem",
  },
  total: {
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
}));

const ResultsTableSubheaderRow = ({ title, data = {} }) => {
  const classes = useStyles();

  return (
    <TableRow className={classes.row}>
      <TableCell className={classes.title}>{title}</TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell className={classes.total}>
        {Object.values(data).reduce((acc, curr) => acc + (curr.search || 0), 0)}
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};

export default ResultsTableSubheaderRow;
