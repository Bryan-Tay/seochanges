import React from "react";
import ResultsTableRow from "./ResultsTableRow";
import ResultsTableSubheaderRow from "./ResultsTableSubheaderRow";

const ResultsTableSection = ({
  data = {},
  order = null,
  orderBy = null,
  subheader = null,
}) => {
  const stableSort = (data) => {
    let entries = Object.entries(data);
    if (!order || !orderBy) return entries;

    return entries.sort((a, b) => {
      let aa = parseFloat(String(a[1][orderBy]).replace(/\D/g)) || 0;
      let bb = parseFloat(String(b[1][orderBy]).replace(/\D/g)) || 0;
      let dir = order === "desc" ? 1 : -1;
      if (bb < aa) return -1 * dir;
      if (bb > aa) return 1 * dir;
      return 0;
    });
  };

  if (Object.keys(data).length === 0) return null;

  return (
    <>
      {subheader && <ResultsTableSubheaderRow title={subheader} data={data} />}
      {stableSort(data).map(([kw, kwdata]) => (
        <ResultsTableRow key={kw} kwdata={kwdata} />
      ))}
    </>
  );
};

export default ResultsTableSection;
