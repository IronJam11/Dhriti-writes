import * as React from 'react';
import Button from '@mui/material/Button';
import SimpleAlert from '../alerts/greenAlert';

function ButtonUsage() {
  const [showAlert, setShowAlert] = React.useState(false);

  const handleClick = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); // Auto-hide after 3 sec
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClick}>Hello world</Button>
      {showAlert && <SimpleAlert />}
    </div>
  );
}

export default ButtonUsage;
