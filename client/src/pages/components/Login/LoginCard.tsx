import React, { useState } from 'react';
import { handleLogin } from '../../../api/handleLogin';
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
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AlternateEmail,
  LockOutlined,
  PersonOutline,
} from '@mui/icons-material';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { LOGIN_PAGE_GREETING } from '../../../constants/auth_pages';

const LoginCard: React.FC = () => {
  const theme = useTheme();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await handleLogin({ email: identifier, password });
      console.log(response);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.href = '/';
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
                {LOGIN_PAGE_GREETING}
              </Typography>

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
                Sign in to your account to continue
              </Typography>

              <Box component="form" onSubmit={handleSubmit} noValidate>
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
                        {identifier.includes('@') ? (
                          <AlternateEmail color="primary" />
                        ) : (
                          <PersonOutline color="primary" />
                        )}
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
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
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
                    sx={{ 
                      textTransform: 'none',
                      color: 'primary.main',
                      transition: theme.transitions.create(['color'], {
                        duration: theme.transitions.duration.standard,
                      }),
                    }}
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
                    color: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
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
                  {isLoading ? 'Signing in...' : 'Sign In'}
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