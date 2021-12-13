import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import {Link, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import * as React from "react";
import {useContext, useState} from "react";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import {yellow} from "@mui/material/colors";
import {GlobalStoreContext} from '../store'

const ListItemStyled = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    boxShadow: 'none',
    borderRadius: 0,
    backgroundColor: 'transparent',
    color: '#feff8c',
    fontSize: '1.2rem',
}));

const CommentItemStyled = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    backgroundColor: yellow.A100,
    color: theme.palette.text.secondary,
}));

export default function CollapseCardExpand(props) {

    const {store} = useContext(GlobalStoreContext);

    const {expanded, list, disableActions} = props;

    const items = list.items;

    const [commentText, setCommentText] = useState('')

    function handleCommentInputUpdate(event) {
        setCommentText(event.target.value)
    }

    function handleCommentInputOnKeyPress(event) {
        if (event.code === "Enter"
            && commentText
        ) {
            // console.log(commentText)
            setCommentText("")

            store.commentOnTop5List(list._id, commentText)
                .then((data) => {
                    // console.log(data)
                    // console.log('commentOnTop5List', data)
                })
                .catch((error) => {
                    // console.error(error)
                })
        }
    }

    const height = () => {
        return list.community ? '400px': '300px';
    }

    return (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
                <Grid container spacing={2} sx={{
                    // height: '300px',
                    height: height(),
                    // minHeight: '300px',
                    // height: 'fit-content',
                    // maxHeight: '400px',
                    overflow: 'hidden'
                }}>
                    <Grid item xs={5} sx={{
                        height: '100%'
                    }}>
                        <Stack
                            direction="column"
                            justifyContent="space-evenly"
                            alignItems="stretch"
                            // spacing={0.5}
                            sx={{
                                height: '100%',
                                backgroundColor: '#6c59c2c9',
                            }}
                        >
                            {
                                items.map((item, index) =>
                                    <ListItemStyled key={index}>
                                        {index + 1}. {item}

                                        {
                                            list.community === true ?
                                                <Typography variant='span' sx={{display: 'block'}}>
                                                    ({list.votes[index]} votes)
                                                </Typography> : ''
                                        }
                                    </ListItemStyled>
                                )
                            }
                        </Stack>
                    </Grid>
                    {
                        list.published ?
                            <Grid item xs={7} sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                height: '100%'
                            }}>
                                <Stack
                                    direction="column"
                                    justifyContent="flex-start"
                                    alignItems="stretch"
                                    spacing={1}
                                    sx={{
                                        flex: 1,
                                        overflowY: 'auto',
                                    }}
                                >
                                    {
                                        list.comments?list.comments.map(comment => <CommentItemStyled key={comment._id}>
                                                {/*<Link component={RouterLink} to={"/user/"+comment.user.username} underline="always">*/}
                                                {/*    {comment.user.username}*/}
                                                {/*</Link>*/}
                                                <Link underline="always">
                                                    {comment.user.username}
                                                </Link>
                                                <Typography paragraph>
                                                    {comment.text}
                                                </Typography>
                                            </CommentItemStyled>
                                        ): ''
                                    }
                                </Stack>
                                <Box sx={{
                                    height: '50px'
                                }}>
                                    <TextField
                                        disabled={disableActions}
                                        sx={{display: 'inline-block', marginTop: '8px',}} size="small"
                                        fullWidth={true}
                                        onChange={handleCommentInputUpdate}
                                        onKeyPress={handleCommentInputOnKeyPress}
                                        value={commentText}
                                        margin="normal"/>
                                </Box>
                            </Grid>
                            : ''
                    }
                </Grid>
            </CardContent>
        </Collapse>
    )
}