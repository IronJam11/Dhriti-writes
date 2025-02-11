import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';
import { handleRegister } from '../../../api/handleRegister';
import { handleOTPVerification } from '../../../api/handleOtpVerification';

const RegisterCard: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const [otpID, setOtpID] = useState('');
  const [userId, setUserId] = useState('');


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isSubmitted) {
      // Register the user and send OTP
      const response = await handleRegister({
        username,
        email,
        password,
        name,
      });

      if (response && response.otp_id) {
        setOtpID(response.otp_id); 
        setUserId(response.user);
        setIsSubmitted(true);  
      }
    } else {
      const response = await handleOTPVerification({
        otp,
        otp_id: otpID,
        "user_id": userId
      });
      if (response) {
        window.location.href = '/login';
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
      }}
    >
      <Card sx={{ maxWidth: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Register to create an account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isSubmitted && <TextField
              margin="normal"
              required
              fullWidth
              name="otp"
              label="otp"
              type="otp"
              id="otp"
              autoComplete="current-password"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />}
            <Button
                type="submit"
                fullWidth
                color="primary"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {isSubmitted ? 'Submit OTP' : 'Register'}
            </Button>
            
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterCard;
