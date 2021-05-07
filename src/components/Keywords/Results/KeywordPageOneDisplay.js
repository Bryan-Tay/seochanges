import React from "react";
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
        marginBottom: "20px",
        border: "1px solid cadetblue",
        padding: "0 10px",
    },
}));

const KeywordPageOneDisplay = ({ keyword, data, setShow }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <h2>
                Keyword: {keyword}
                <span
                    style={{
                        float: "right",
                        position: "relative",
                        top: "-15px",
                        color: "maroon",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        setShow(false);
                    }}
                >
                    X
                </span>
            </h2>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>URL</TableCell>
                            <TableCell>DA</TableCell>
                            <TableCell>PA</TableCell>
                            <TableCell>TF</TableCell>
                            <TableCell>CF</TableCell>
                            <TableCell>Links</TableCell>
                            <TableCell>FB</TableCell>
                            <TableCell>LPS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data[0].items.map((item, index) => {
                            return (
                                <TableRow key={index} hover={true}>
                                    <TableCell>
                                        <a
                                            href={item.url}
                                            rel='nofollow external noopener noreferrer'
                                            target='_blank'
                                        >
                                            {item.url}
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        {item.m.moz.v.pda
                                            ? item.m.moz.v.pda
                                            : ""}
                                    </TableCell>
                                    <TableCell>
                                        {item.m.moz.v.upa
                                            ? item.m.moz.v.upa
                                            : ""}
                                    </TableCell>
                                    <TableCell>
                                        {item.m.majestic.v.TrustFlow
                                            ? item.m.majestic.v.TrustFlow
                                            : ""}
                                    </TableCell>
                                    <TableCell>
                                        {item.m.majestic.v.CitationFlow
                                            ? item.m.majestic.v.CitationFlow
                                            : ""}
                                    </TableCell>
                                    <TableCell>
                                        {item.m.majestic.v.ExtBackLinks
                                            ? item.m.majestic.v.ExtBackLinks
                                            : ""}
                                    </TableCell>
                                    <TableCell>
                                        {item.m.fb ? item.m.fb.v.l : ""}
                                    </TableCell>
                                    <TableCell>
                                        {item.m.rank.v.r ? item.m.rank.v.r : ""}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default KeywordPageOneDisplay;
