import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import * as React from 'react';
import { UserContext } from '../../contexts/UserContext';

const { VITE_CHAT_API_URL } = import.meta.env;

export default function Product({ product, isLoading }) {
  const { user } = React.useContext(UserContext);
  const displayPrice = !!product?.price ? product.price / 100 : 0;

  const onCheckoutClick = async (_e) => {
    const { data } = await axios.post(`${VITE_CHAT_API_URL}/stripe/create-checkout-session`, { id: product.id });
    if (data?.url) {
      window.location.href = data.url;
    } else {
      console.error('Error creating checkout session');
    }
  };

  const activePlan = product.name !== 'Free' && user.subscription?.displayName === product.name;

  const bgColor = 'rgb(63, 147, 120)';

  return (
    <Card elevation={12} sx={{
      borderRadius: 3, minWidth: 200, minHeight: 220, display: 'grid',
      ...((activePlan) && { bgcolor: bgColor })
    }}>
      <CardHeader
        title={product.name}
        subheader={`$${displayPrice} per month`}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {product.desc}
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ justifyContent: 'end' }}>
        {!product.id
          ? <Button variant='contained' disabled>Free</Button>
          : <Button variant='contained' disabled={isLoading || activePlan} onClick={onCheckoutClick}>{`$${displayPrice} Buy`}</Button>
        }
      </CardActions>
    </Card>
  );
};