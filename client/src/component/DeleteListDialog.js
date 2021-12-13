import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React, {useContext, useEffect, useState} from "react";
import {GlobalStoreContext} from '../store'

export default function DeleteListDialog(props) {

    const {store} = useContext(GlobalStoreContext);

    const open = store.listMarkedForDeletion !== null;

    const [name, setName] = useState('')
    useEffect(() => {
        if (store.listMarkedForDeletion) {
            setName(store.listMarkedForDeletion.name)
        }
    }, [store.listMarkedForDeletion]);

    const handleClose = () => {
        store.unmarkListForDeletion();
    }

    const handleConfirm = () => {
        store.deleteMarkedList();
    }

    return <Dialog
        open={open}
        onClose={handleClose}
    >
        <DialogTitle>
            Delete the {name} Top 5 List?
        </DialogTitle>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleConfirm} autoFocus>
                Confirm
            </Button>
        </DialogActions>
    </Dialog>
}