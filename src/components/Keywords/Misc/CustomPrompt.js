import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";
import { Prompt } from "react-router-dom";

const CustomPrompt = () => {
    const [block, setBlock] = useState(true);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
        return false;
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Prompt when={block} message={handleOpen} />
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>
                    {"There might be unsaved changes."}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        Are you sure you want to leave?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='primary'>
                        Dismiss
                    </Button>
                    <Button
                        onClick={() => {
                            handleClose();
                            setBlock(false);
                        }}
                        color='primary'
                        autoFocus
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CustomPrompt;
