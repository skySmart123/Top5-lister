import React, {useContext, useEffect, useState} from "react";
import CollapseCard from "../component/CollapseCard";
import {Typography} from "@mui/material";
import {GlobalStoreContext} from '../store'

export default function AllPage(props) {

    const {store} = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadAllList()
    }, [store.search, store.sort]);

    const lists = store.allList?store.allList:[];
    // console.log(lists)

    const search = store.search;

    return <>

        <div className="content-scroll">
            {
                lists?.map((list) => (
                    <CollapseCard
                        key={list._id}
                        list={list}
                    />
                ))
            }

        </div>

        <div className="bottom-status">

            <Typography variant="h3" sx={{}}>
                {
                    search ? search + ' Lists' : 'All Lists'
                }
            </Typography>

        </div>
    </>
}