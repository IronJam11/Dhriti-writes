import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Container,
  IconButton,
  InputAdornment,
  LinearProgress,
  Fade,
  Divider
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  PersonOutline,
  AlternateEmail,
  LockOutlined,
  VerifiedUser
} from '@mui/icons-material';
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!isSubmitted) {
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
          user_id: userId
        });
        if (response) {
          window.location.href = '/login';
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '',
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={1000}>
          <Card 
            sx={{ 
              maxWidth: 450,
              mx: 'auto',
              borderRadius: 3,
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            {isLoading && <LinearProgress />}
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h4" 
                component="div" 
                gutterBottom 
                sx={{ 
                  textAlign: 'center',
                  fontWeight: 700,
                  mb: 3,
                  color: 'primary.main'
                }}
              >
                {isSubmitted ? 'Verify OTP' : 'Register to get bombarded with tamasha references 🥰'}
              </Typography>

              {!isSubmitted && (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ textAlign: 'center', mb: 4 }}
                >
                  Fill in your information to get started
                </Typography>
              )}

              <Box 
                component="form" 
                onSubmit={handleSubmit} 
                noValidate 
                sx={{ mt: 1 }}
              >
                {!isSubmitted ? (
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="name"
                      label="Full Name"
                      name="name"
                      autoComplete="name"
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutline color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
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
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <VerifiedUser color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
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
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AlternateEmail color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                  </>
                ) : (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="otp"
                    label="Enter OTP"
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                    },
                  }}
                  disabled={isLoading}
                >
                  {isLoading 
                    ? 'Processing...' 
                    : (isSubmitted ? 'Verify OTP' : 'Create Account')}
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  href="/login"
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5,
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default RegisterCard;