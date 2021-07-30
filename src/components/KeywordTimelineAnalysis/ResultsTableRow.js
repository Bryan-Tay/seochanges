import React from "react";
import { Button, IconButton, TableCell, TableRow } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useKeywords } from "../../hooks/useKeywords";
import { RefreshOutlined } from "@material-ui/icons";

const ResultsTableRow = ({ kwdata }) => {
  const { setActiveKeyword, removeKeyword, refreshKeyword } = useKeywords();

  return (
    <TableRow>
      <TableCell>
        <Button
          fullWidth
          size="small"
          color="primary"
          variant="outlined"
          onClick={() => setActiveKeyword(kwdata.kw)}
        >
          {kwdata.kw}
        </Button>
      </TableCell>
      <TableCell>{kwdata.kd || "-"}</TableCell>
      <TableCell>{kwdata.rank || "-"}</TableCell>
      <TableCell>{kwdata.search || "-"}</TableCell>
      <TableCell>{parseFloat(kwdata.ev).toFixed(0) || "-"}</TableCell>
      <TableCell>{parseFloat(kwdata.cpc).toFixed(2) || "-"}</TableCell>
      <TableCell>{kwdata.ppc || "-"}</TableCell>
      <TableCell>{kwdata.level === "low" ? "✔" : ""}</TableCell>
      <TableCell>{kwdata.level === "medium" ? "✔" : ""}</TableCell>
      <TableCell>{kwdata.level === "high" ? "✔" : ""}</TableCell>
      <TableCell>{kwdata.level === "others" ? "✔" : ""}</TableCell>
      <TableCell>{kwdata.path || ""}</TableCell>
      <TableCell style={{ maxWidth: "40px" }}>
        <IconButton
          aria-label="delete"
          onClick={() => refreshKeyword(kwdata.kw)}
        >
          <RefreshOutlined fontSize="small" />
        </IconButton>
      </TableCell>
      <TableCell style={{ maxWidth: "40px" }}>
        <IconButton
          aria-label="delete"
          onClick={() => removeKeyword(kwdata.kw)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default ResultsTableRow;
