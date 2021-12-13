import useNotification from './hook'
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    notificationAlert: {
        "& .MuiAlert-icon": {
            fontSize: 40
        }
    }
});

export default function Notification() {
    const classes = useStyles();

    const {error, removeError} = useNotification()

    const handleClose = () => {
        removeError()
    };

    // const open = !!error
    const open = !!error.message

    const message = error && error.message ? error.message : ''

    // success or error
    const status = error && error.status ? error.status : ''

    // console.log('error', error)
    const [msg, setMsg] = useState('');
    const [type, setType] = useState('error')
    useEffect(() => {
        if (message) {
            setMsg(message)
            setType(status)
        }
    }, [message])


    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth='sm'
            fullWidth={true}
        >
            <DialogTitle id="alert-dialog-title">
                {/*Error*/}
                {capitalize(type)}
            </DialogTitle>
            <DialogContent>
                {/*<DialogContentText id="alert-dialog-description">*/}

                {/*<Alert severity="error">*/}
                {/*<Alert severity="success">*/}
                {/*<Alert severity="warning">*/}
                <Alert
                    className={classes.notificationAlert}
                    severity={type}
                    sx={{fontSize: '1.5rem'}}
                >
                    {/*<AlertTitle>Error</AlertTitle>*/}

                    {/*{message}*/}
                    {msg}
                </Alert>
                
                {/*</DialogContentText>*/}
            </DialogContent>
            <DialogActions>
                {/*<Button onClick={handleClose}>Disagree</Button>*/}
                <Button
                    onClick={handleClose}
                    // autoFocus
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    )
}