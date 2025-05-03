import React from 'react';
import { Box, Typography } from '@mui/material';

const Templates: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Workflow Templates
      </Typography>
      <Typography variant="body1">
        Browse and manage your workflow templates here.
      </Typography>
    </Box>
  );
};

export default Templates; 