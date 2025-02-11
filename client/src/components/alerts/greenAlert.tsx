import * as React from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

export default function GreenAlert() {
  return (
    <Alert severity="warning" icon={<CheckIcon fontSize="inherit" />}>
      Here is a gentle confirmation that your action was successful.
    </Alert>
  );
}