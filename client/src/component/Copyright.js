import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {Link as RouteLink} from 'react-router-dom';

export default function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" component={RouteLink} to="/">
                The Top 5 Lister
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}

            <br/>
            Created by Yang Yu
        </Typography>
    );
}