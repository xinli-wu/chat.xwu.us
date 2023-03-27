import { Grid } from '@mui/material';
import React from 'react';
import Product from './Product';

export const ProductDisplay = () => {
  const [expanded, setExpanded] = React.useState(true);

  const products = [
    {
      lookupKey: 'test2222', price: 2.99, title: 'Small', desc: 'I only chat',
      feature: [{ id: 1, desc: 'chat', config: () => 100 }, { id: 2, desc: 'image', config: () => undefined }]
    },
    {
      lookupKey: 2, price: 6.99, title: 'Medium', desc: 'I only chat',
      feature: [{ id: 1, desc: 'chat', config: () => 200 }, { id: 2, desc: 'image', config: () => undefined }]
    },
    {
      lookupKey: 3, price: 9.99, title: 'Large', desc: 'I only chat',
      feature: [{ id: 1, desc: 'chat', config: () => 300 }, { id: 2, desc: 'image', config: () => undefined }]
    },
  ];

  return (
    <Grid container spacing={2}>
      {products.map(product => (
        <Grid key={product.lookupKey} item xs={12} sm={4} md={4} lg={4} xl={4}>
          <Product expanded={expanded} setExpanded={setExpanded} product={product} />
        </Grid>
      ))}
    </Grid>
  );
};
