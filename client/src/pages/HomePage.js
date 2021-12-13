import React, {useContext, useEffect, useState} from "react";
import {GlobalStoreContext} from '../store'
import {Fab, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditListDialog from '../component/EditListDialog';
import CollapseCard from "../component/CollapseCard";
import DeleteListDialog from "../component/DeleteListDialog";

export default function HomePage() {

    const {store} = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadYourList()

    }, [store.search, store.sort]);

    const lists = store.yourList ? store.yourList : [];
    // console.log(lists)

    const search = store.search;
    // console.log('search yours: ', search)

    const handleClickOpen = async () => {
        store.createNewList()
        // .then((data) => {
        //     console.log(data)
        // })
    };

    return <>
        <div className="content-scroll">
            {
                lists?.map((pair) => (
                    <CollapseCard
                        key={pair._id}
                        list={pair}
                        showDelete={true}
                    />
                ))
            }
        </div>

        <div className="bottom-status">
            <Fab
                color="primary"
                aria-label="add"
                className="add-list-button"
                size={"large"}
                onClick={handleClickOpen}
            >
                <AddIcon/>
            </Fab>

            <Typography variant="h3" sx={{}}>
                {
                    search ? 'Your ' + search + ' Lists' : 'Your Lists'
                }
            </Typography>

            <EditListDialog/>
            <DeleteListDialog/>
        </div>
    </>
}