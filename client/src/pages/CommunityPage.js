import React, {useContext, useEffect} from "react";
import CollapseCard from "../component/CollapseCard";
import {Typography} from "@mui/material";
import {GlobalStoreContext} from '../store'

export default function CommunityPage(props) {
    const {store} = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadCommunityList()

    }, [store.search, store.sort]);

    const lists = store.communityList?store.communityList:[];
    // console.log(lists)
    //
    const search = store.search;
    // console.log('search community: ', search)

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
                    search ? search + ' Lists' : 'Community Lists'
                }
            </Typography>

        </div>
    </>
}