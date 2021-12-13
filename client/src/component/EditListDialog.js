import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Box, TextField, Typography} from "@mui/material";
import Stack from "@mui/material/Stack";
import {useContext, useEffect, useState} from "react";
import {GlobalStoreContext} from '../store'

export default function EditListDialog(props) {

    const {store} = useContext(GlobalStoreContext);

    const open = store.currentList !== null;

    const handleSave = async () => {
        // console.log('save:', title, items)

        store.saveCurrentList(title, items)
    };

    const handlePublish = () => {
        store.publishTop5List(title, items)
    };

    const handleClose = () => {
        store.setCurrentListForEdit(null);
    }

    useEffect(() => {
        if (store.currentList) {
            setTitle(store.currentList.name)
            setItems(store.currentList.items)
        }
    }, [store.currentList]);

    const [title, setTitle] = useState('');
    const [items, setItems] = useState(
        ['', '', '', '', '']
    );

    function handleUpdateTitle(event) {
        setTitle(event.target.value);
        // console.log(title)
    }

    function handleUpdateItem(event, i) {
        let its = items.slice();
        its[i] = event.target.value
        setItems(its);
        // console.log(items)
    }

    // list title and items
    const titleNotEmpty = !!title;
    const itemsSomeNotEmpty = items && items.some(item => !!item);
    const enableSave = titleNotEmpty && itemsSomeNotEmpty;
    // const enableSave = true;
    const itemsEveryNotEmpty = items && items.every(item => !!item);
    const enablePublish = titleNotEmpty && itemsEveryNotEmpty;

    return (
        <>
            <Dialog
                maxWidth='sm'
                fullWidth={true}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="List title"
                        fullWidth
                        variant="standard"
                        onChange={handleUpdateTitle}
                        value={title}
                        autoFocus
                    />
                </DialogTitle>
                <DialogContent>
                    <Stack
                        direction="column"
                        alignItems="stretch"
                        spacing={0.5}
                    >
                        {
                            items.map((item, i) => {
                                return <Box
                                    key={i + 1}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <Typography sx={{
                                        padding: '10px',
                                        marginRight: '10px',
                                        backgroundColor: '#e2ace2'
                                    }}>
                                        {i + 1}.
                                    </Typography>
                                    <TextField
                                        margin="dense"
                                        label="item"
                                        fullWidth
                                        variant="standard"
                                        onChange={(event) => {
                                            handleUpdateItem(event, i)
                                        }}
                                        value={item}
                                    />
                                </Box>
                            })
                        }
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleSave}
                        disabled={!enableSave}
                    >
                        Save
                    </Button>
                    <Button
                        onClick={handlePublish}
                        disabled={!enablePublish}
                    >
                        Publish
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
