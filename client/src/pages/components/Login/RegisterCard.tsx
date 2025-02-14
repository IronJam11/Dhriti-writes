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
  Divider,
  useTheme
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
import { ThemeToggle } from '../../../components/ThemeToggle';
import { REGISTER_PAGE_GREETING } from '../../../constants/auth_pages';

const RegisterCard: React.FC = () => {
  const theme = useTheme();
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
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        transition: theme.transitions.create(['background-color'], {
          duration: theme.transitions.duration.standard,
        }),
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <ThemeToggle />
      </Box>
      
      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Fade in timeout={1000}>
          <Card 
            sx={{ 
              width: '100%',
              maxWidth: 450,
              mx: 'auto',
              borderRadius: 3,
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 8px 40px rgba(0,0,0,0.3)' 
                : '0 8px 40px rgba(0,0,0,0.12)',
              backgroundColor: 'background.paper',
              transition: theme.transitions.create(
                ['background-color', 'box-shadow'],
                {
                  duration: theme.transitions.duration.standard,
                }
              ),
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
                  color: 'primary.main',
                  transition: theme.transitions.create(['color'], {
                    duration: theme.transitions.duration.standard,
                  }),
                }}
              >
                {isSubmitted ? 'Verify OTP' : REGISTER_PAGE_GREETING}
              </Typography>

              {!isSubmitted && (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    textAlign: 'center', 
                    mb: 4,
                    transition: theme.transitions.create(['color'], {
                      duration: theme.transitions.duration.standard,
                    }),
                  }}
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
                    color: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 4px 12px rgba(255,255,255,0.1)'
                      : '0 4px 12px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 6px 16px rgba(255,255,255,0.15)'
                        : '0 6px 16px rgba(0,0,0,0.15)',
                    },
                    transition: theme.transitions.create(
                      ['background-color', 'box-shadow'],
                      {
                        duration: theme.transitions.duration.standard,
                      }
                    ),
                  }}
                  disabled={isLoading}
                >
                  {isLoading 
                    ? 'Processing...' 
                    : (isSubmitted ? 'Verify OTP' : 'Create Account')}
                </Button>

                <Divider 
                  sx={{ 
                    my: 3,
                    '&::before, &::after': {
                      borderColor: 'divider',
                    },
                  }}
                >
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      transition: theme.transitions.create(['color'], {
                        duration: theme.transitions.duration.standard,
                      }),
                    }}
                  >
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
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    transition: theme.transitions.create(
                      ['border-color', 'color'],
                      {
                        duration: theme.transitions.duration.standard,
                      }
                    ),
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