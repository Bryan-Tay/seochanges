import React, { useState, useEffect } from "react";
import { Button, TableCell, TableRow } from "@material-ui/core";

const RelatedKeywordRow = ({
    keywords,
    keyword,
    index,
    setExtraRelatedKeywords,
    load,
    extraRelatedKeywords,
}) => {
    const [disableButton, setDisableButton] = useState(false);
    const [text, setText] = useState("Add");

    useEffect(() => {
        setDisableButton(false);
        setText("Add");
    }, [keyword]);
    return (
        <TableRow key={index} hover={true}>
            <TableCell>{keyword.kw}</TableCell>
            <TableCell>
                {keywords.includes(keyword.kw) ? (
                    <Button>Added!</Button>
                ) : extraRelatedKeywords.includes(keyword.kw) ? (
                    <Button>Added!</Button>
                ) : (
                    <Button
                        variant={
                            load
                                ? disableButton
                                    ? "contained"
                                    : "outlined"
                                : "contained"
                        }
                        color='primary'
                        disabled={load ? (disableButton ? true : false) : true}
                        onClick={() => {
                            setExtraRelatedKeywords(keyword.kw);
                            setDisableButton(true);
                            setText("Added!");
                        }}
                    >
                        {text}
                    </Button>
                )}
            </TableCell>
            <TableCell>{keyword.sv}</TableCell>
            <TableCell>{keyword.seo}</TableCell>
        </TableRow>
    );
};

export default RelatedKeywordRow;
