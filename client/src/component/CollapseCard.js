import * as React from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {ThumbDown, ThumbUp} from "@mui/icons-material";
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import {Link, TextField} from "@mui/material";
import {useContext, useState} from "react";
import {GlobalStoreContext} from '../store'
import {Link as RouterLink, useLocation} from 'react-router-dom';
import AuthContext from "../auth";
import CollapseCardExpand from "./CollapseCardExpand";

const ExpandMore = styled((props) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function CollapseCard(props) {
    const showDelete = props.showDelete ? props.showDelete : false;

    const {list} = props;

    const {store} = useContext(GlobalStoreContext);

    const {auth} = useContext(AuthContext);

    const disableActions = !auth.loggedIn;

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);

        if (!expanded) {
            // console.log('count view + 1')
            store.increaseViews(list._id)
        }
    };

    const handleEditList = (top5List) => {
        store.setCurrentListForEdit(top5List)
    }

    const handleDeleteList = (top5List) => {
        store.markListForDeletion(top5List);
    }

    const dateString = (timestamp) => {
        const date = new Date(timestamp)
        return date.toLocaleDateString() + " " + date.toLocaleTimeString()
    }

    const handleListLike = (id) => {
        store.likeOrDislike(id, 'like')
    }
    const handleListDislike = (id) => {
        store.likeOrDislike(id, 'dislike')
    }

    return (
        <Card sx={{
            marginTop: '20px',
            marginBottom: '20px',
            backgroundColor: '#f1eefead',
            borderRadius: '5px',
        }}>
            <CardHeader
                action={
                    <Stack direction="row" spacing={1}>
                        <Button
                            disabled={disableActions}
                            onClick={(event) => {
                                handleListLike(list._id)
                            }} color="secondary" startIcon={<ThumbUp/>}>
                            {list.likes}
                        </Button>
                        <Button
                            disabled={disableActions}
                            onClick={(event) => {
                                handleListDislike(list._id)
                            }} color="primary" startIcon={<ThumbDown/>}>
                            {list.dislikes}
                        </Button>
                        {
                            showDelete ?
                                <IconButton onClick={(event) => {
                                    // handleDeleteList(list._id)
                                    handleDeleteList(list)
                                }} aria-label="delete">
                                    <DeleteIcon/>
                                </IconButton> : ''
                        }
                    </Stack>
                }
                title={list.name}
                subheader={
                    list.community === true ? '' : <Typography variant="body2">
                        By:
                        {/*<Link component={RouterLink} to={"/user/"+list.user.username} underline="always">*/}
                        {/*    {list.user.username}*/}
                        {/*</Link>*/}
                        <Link underline="always">
                            {list.user.username}
                        </Link>
                    </Typography>
                }
                sx={{
                    paddingBottom: 0,
                }}
            />

            <CollapseCardExpand
                expanded={expanded}
                list={list}
                disableActions={disableActions}
            />

            <CardActions disableSpacing>
                {
                    list.published === false ? <Button onClick={(event) => {
                        handleEditList(list)
                    }} color='error' sx={{
                        textTransform: 'none'
                    }}>
                        Edit
                    </Button> : ''
                }
                {
                    list.published === true ? <Typography variant="body2" color="primary">
                        {
                            list.community === true ? 'Updated:' : 'Published:'
                        }
                        <span style={{
                            color: 'green'
                        }}>
                        {dateString(list.publishedAt)}
                    </span>
                    </Typography> : ''
                }
                <Typography sx={{
                    marginLeft: 'auto',
                    marginRight: '50px'
                }} variant="body2" color="primary">
                    Views:
                    <span style={{
                        color: 'red'
                    }}>
                    {list.views}
                </span>
                </Typography>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon/>
                </ExpandMore>
            </CardActions>
        </Card>
    );
}