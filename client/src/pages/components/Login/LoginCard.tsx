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
  AlternateEmail,
  LockOutlined,
  PersonOutline
} from '@mui/icons-material';

const LoginCard: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      // Handle login logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
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
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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
                Welcome Back fellow poet 🥸
              </Typography>

              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ textAlign: 'center', mb: 4 }}
              >
                Sign in to your account to continue
              </Typography>

              <Box 
                component="form" 
                onSubmit={handleSubmit} 
                noValidate 
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="identifier"
                  label="Email or Username"
                  name="identifier"
                  autoComplete="email"
                  autoFocus
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {identifier.includes('@') ? 
                          <AlternateEmail color="primary" /> : 
                          <PersonOutline color="primary" />
                        }
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

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Button
                    href="/forgot-password"
                    variant="text"
                    sx={{ textTransform: 'none' }}
                  >
                    Forgot password?
                  </Button>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    mb: 3,
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
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  href="/register"
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5,
                  }}
                >
                  Create Account
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default LoginCard;