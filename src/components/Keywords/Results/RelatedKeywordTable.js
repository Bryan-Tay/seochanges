import React, { useState, useEffect } from "react";
import RelatedKeywordRow from "./RelatedKeywordRow";
import { makeStyles } from "@material-ui/core/styles";
import {
    Table,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
    TableContainer,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
    root: {
        backgroundColor: "aliceblue",
        margin: "0px 1px 20px 1px",
        border: "1px solid cadetblue",
        padding: "2px 10px",
    },
}));

const RelatedKeywordTable = ({
    displayRelatedKeywords,
    setExtraRelatedKeywords,
    load,
    keywords,
    extraRelatedKeywords,
    text,
}) => {
    const classes = useStyles();
    let process = displayRelatedKeywords.slice(1);
    const [easy, setEasy] = useState();
    const [medium, setMedium] = useState();
    const [hard, setHard] = useState();
    useEffect(() => {
        process.sort((a, b) => a.seo - b.seo);
        let a = process
            .slice(0, Math.floor(process.length / 3))
            .sort((a, b) => b.sv - a.sv);
        let b = process
            .slice(
                Math.floor(process.length / 3) + 1,
                Math.floor((process.length * 2) / 3)
            )
            .sort((a, b) => b.sv - a.sv);
        let c = process
            .slice(Math.floor((process.length * 2) / 3) + 1, process.length)
            .sort((a, b) => b.sv - a.sv);
        setEasy(a);
        setMedium(b);
        setHard(c);
    }, [displayRelatedKeywords]);
    return (
        <div className={classes.root}>
            <h2>{text} Competition</h2>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Keyword</TableCell>
                            <TableCell>Add to List</TableCell>
                            <TableCell>Search Volume</TableCell>
                            <TableCell>Difficulty</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {text === "Low" && easy ? (
                            easy.map((keyword, index) => {
                                return (
                                    <RelatedKeywordRow
                                        keyword={keyword}
                                        index={index}
                                        key={index}
                                        setExtraRelatedKeywords={
                                            setExtraRelatedKeywords
                                        }
                                        load={load}
                                        keywords={keywords}
                                        extraRelatedKeywords={
                                            extraRelatedKeywords
                                        }
                                    />
                                );
                            })
                        ) : text === "Medium" && medium ? (
                            medium.map((keyword, index) => {
                                return (
                                    <RelatedKeywordRow
                                        keyword={keyword}
                                        index={index}
                                        key={index}
                                        setExtraRelatedKeywords={
                                            setExtraRelatedKeywords
                                        }
                                        load={load}
                                        keywords={keywords}
                                        extraRelatedKeywords={
                                            extraRelatedKeywords
                                        }
                                    />
                                );
                            })
                        ) : hard ? (
                            hard.map((keyword, index) => {
                                return (
                                    <RelatedKeywordRow
                                        keyword={keyword}
                                        index={index}
                                        key={index}
                                        setExtraRelatedKeywords={
                                            setExtraRelatedKeywords
                                        }
                                        load={load}
                                        keywords={keywords}
                                        extraRelatedKeywords={
                                            extraRelatedKeywords
                                        }
                                    />
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default RelatedKeywordTable;
