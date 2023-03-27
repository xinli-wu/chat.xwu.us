import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Divider } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import * as React from 'react';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginRight: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Product({ expanded, setExpanded, product }) {

  const onCheckoutClick = async (_e) => {
    const { data } = await axios.post(`${process.env.REACT_APP_CHAT_API_URL}/stripe/create-checkout-session`, { lookup_key: product.lookupKey });
    if (data?.url) {
      window.location.href = data.url;
    } else {
      console.error('Error creating checkout session');
    }
  };

  return (
    <Card elevation={24}>
      <CardHeader
        title={product.title}
        subheader={`$${product.price} per month`}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
        <Button onClick={onCheckoutClick}>{`$${product.price} Buy`}</Button>
      </CardActions>
      {expanded && <Divider />}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}