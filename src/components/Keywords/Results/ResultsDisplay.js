import React, { useState } from "react";
import TableExport from "tableexport";
import ClipLoader from "react-spinners/ClipLoader";

import {
    Table,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
    TableContainer,
    Button,
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
} from "@material-ui/core";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";

const ResultsDisplay = ({
    keywords,
    load,
    handleShow,
    currentRanking,
    volume,
    FS,
    DF,
    allQ2,
    allQ3,
    allQ4,
    allUrls,
    extraKW,
    setExtraRelatedKeywords,
}) => {
    const [extra, setExtra] = useState();
    const handleSubmit = (e) => {
        e.preventDefault();
        setExtraRelatedKeywords(extra);
        setExtra("");
    };
    return (
        <div>
            <TableContainer>
                <Table id='main-table'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Keyword</TableCell>
                            <TableCell>Current Rank</TableCell>
                            <TableCell>Search Volume</TableCell>
                            <TableCell>4 - 6 Mths</TableCell>
                            <TableCell>7 - 9 Mths</TableCell>
                            <TableCell>9 - 12 Mths</TableCell>
                            <TableCell>12+ Mths</TableCell>
                            <TableCell>URL</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {keywords ? (
                            keywords.map((keyword, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {load ? (
                                                <Button
                                                    onClick={() => {
                                                        handleShow(index);
                                                    }}
                                                    variant='outlined'
                                                    color='primary'
                                                >
                                                    {keyword}
                                                </Button>
                                            ) : (
                                                <Button>{keyword}</Button>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {currentRanking[index]}
                                        </TableCell>
                                        <TableCell>
                                            {volume[index]
                                                ? volume[index]
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {FS[index] * DF[index] >=
                                            allQ2[index]
                                                ? "✔"
                                                : ""}
                                        </TableCell>
                                        <TableCell>
                                            {FS[index] * DF[index] <
                                                allQ2[index] &&
                                            FS[index] * DF[index] >=
                                                allQ3[index]
                                                ? "✔"
                                                : ""}
                                        </TableCell>
                                        <TableCell>
                                            {FS[index] * DF[index] <
                                                allQ3[index] &&
                                            FS[index] * DF[index] >=
                                                allQ4[index]
                                                ? "✔"
                                                : ""}
                                        </TableCell>
                                        <TableCell>
                                            {FS[index] * DF[index] <
                                            allQ4[index]
                                                ? "✔"
                                                : ""}
                                        </TableCell>
                                        <TableCell>{allUrls[index]}</TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <div m='auto'>
                                <ClipLoader size={50} color={"#123abc"} />
                            </div>
                        )}
                        {extraKW ? (
                            extraKW.map((keyword, index) => {
                                return (
                                    <TableRow key={index + keywords.length}>
                                        <TableCell>
                                            {load ? (
                                                <Button
                                                    onClick={() => {
                                                        handleShow(
                                                            index +
                                                                keywords.length
                                                        );
                                                    }}
                                                    variant='outlined'
                                                    color='primary'
                                                >
                                                    {keyword}
                                                </Button>
                                            ) : (
                                                <Button>{keyword}</Button>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {
                                                currentRanking[
                                                    index + keywords.length
                                                ]
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {volume[index + keywords.length]
                                                ? volume[
                                                      index + keywords.length
                                                  ]
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {FS[index + keywords.length] *
                                                DF[index + keywords.length] >=
                                            allQ2[index + keywords.length]
                                                ? "✔"
                                                : ""}
                                        </TableCell>
                                        <TableCell>
                                            {FS[index + keywords.length] *
                                                DF[index + keywords.length] <
                                                allQ2[
                                                    index + keywords.length
                                                ] &&
                                            FS[index + keywords.length] *
                                                DF[index + keywords.length] >=
                                                allQ3[index + keywords.length]
                                                ? "✔"
                                                : ""}
                                        </TableCell>
                                        <TableCell>
                                            {FS[index + keywords.length] *
                                                DF[index + keywords.length] <
                                                allQ3[
                                                    index + keywords.length
                                                ] &&
                                            FS[index + keywords.length] *
                                                DF[index + keywords.length] >=
                                                allQ4[index + keywords.length]
                                                ? "✔"
                                                : ""}
                                        </TableCell>
                                        <TableCell>
                                            {FS[index + keywords.length] *
                                                DF[index + keywords.length] <
                                            allQ4[index + keywords.length]
                                                ? "✔"
                                                : ""}
                                        </TableCell>
                                        <TableCell>
                                            {allUrls[index + keywords.length]}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <div m='auto'>
                                <ClipLoader size={50} color={"#123abc"} />
                            </div>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <form // Main form.
                    onSubmit={(e) => {
                        handleSubmit(e);
                    }}
                    style={{ margin: "20px 0" }}
                >
                    <FormControl>
                        <InputLabel>Add More Keywords</InputLabel>
                        <Input // Input for URL.
                            type='text'
                            margin='dense'
                            placeholder='i.e. seo services singapore'
                            value={extra}
                            onChange={(e) => setExtra(e.target.value)}
                            style={{ width: "300px" }}
                            endAdornment={
                                <InputAdornment position='end'>
                                    <KeyboardReturnIcon />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </form>
                <Button
                    variant='contained'
                    id='export-button'
                    color='primary'
                    onClick={() => {
                        TableExport(document.getElementById("main-table"));
                        document
                            .getElementById("export-button")
                            .classList.add("exported");
                    }}
                    className='export-button'
                >
                    Export
                </Button>
            </div>
        </div>
    );
};

export default ResultsDisplay;
