import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { useFeatures, usePlans } from '../../hooks/useAPI';
import LoadingProgress from '../LoadingProgress';
import Product from './Product';

export const ProductDisplay = () => {
  const plans = usePlans();
  const features = useFeatures();

  return (
    <Grid container spacing={0}>
      <Paper elevation={6} sx={{ minWidth: 720 }}>
        <LoadingProgress show={plans.isValidating} />
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Plan</TableCell>
                {plans.data?.data.map((p, i) => (
                  <TableCell key={i}>
                    <Product isLoading={plans.isValidating} product={p} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {features.data?.data.map((feature, i) => {
                return (
                  <TableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {feature.desc}
                    </TableCell>
                    {plans.data?.data.map((p, i) => {
                      const curFeature = p.feature.find(
                        (f) => f.id === feature.id,
                      );
                      return (
                        <TableCell key={i} sx={{ textAlign: 'center' }}>
                          {curFeature.quota}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Grid>
  );
};
