import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { 
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  BarChart as BarChartIcon,
  Description as DescriptionIcon,
  Layers as LayersIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import Pieces from './pieces';
import Profile from './profile';
import { getUserDetails } from '../../api/getUserDetails';
import { patchUserDetails } from '../../api/patchUserDetails';
import { ThemeToggle } from '../../components/ThemeToggle';
import { WEBSITE_NAME } from '../../constants/navbarConstants';

const drawerWidth = 240;
interface User {
  email: string;
  name: string;
  username: string;
  bio?: string;
  profile_picture?: string;
  date_joined: string;
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function DhritiWritesDashboard() {
  const theme = useTheme();
  const [user, setUser] = React.useState<User | null>(null);
  const [open, setOpen] = React.useState(true);
  const [reportsOpen, setReportsOpen] = React.useState(false);
  
  // Initialize selectedMenu based on URL hash
  const getInitialRoute = () => {
    const hash = window.location.hash.replace('#', '') || 'pieces';
    return hash as 'pieces' | 'orders' | 'reports' | 'profile';
  };

  const [selectedMenu, setSelectedMenu] = React.useState(getInitialRoute());

  // Update URL hash when menu changes
  const handleMenuSelect = (menu: 'pieces' | 'orders' | 'reports' | 'profile') => {
    setSelectedMenu(menu);
    window.location.hash = menu;
  };

  // Listen for hash changes
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'pieces';
      setSelectedMenu(hash as 'pieces' | 'orders' | 'reports' | 'profile');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleUpdateUser = async (updatedUser: User, photoFile?: File) => {
    try {
        const formData = new FormData();
        if (photoFile) {
            formData.append('profile_picture', photoFile);
        }
        Object.keys(updatedUser).forEach(key => {
            if (key !== 'profile_picture' || !photoFile) {
                formData.append(key, (updatedUser as any)[key]);
            }
        });
        const response = await patchUserDetails(formData);
        console.log(response.data);
        setUser(response.data);
    } catch (error) {
        console.error('Error updating user:', error);
    }
  };

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserDetails();
        const fetchedUser = response.data;
        setUser(fetchedUser);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const renderContent = () => {
    switch (selectedMenu) {
      case 'pieces':
        return <Pieces />;
      case 'orders':
        return <Typography variant="h4">Orders Section</Typography>;
      case 'reports':
        return <Typography variant="h4">Reports Section</Typography>;
      case 'profile':
        return user ? <Profile user={user} onUpdate={handleUpdateUser} /> : <Typography variant="h4">Loading...</Typography>;
      default:
        return <Typography variant="h4">Select a section</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {WEBSITE_NAME}
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            Menu
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleMenuSelect('pieces')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Pieces" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleMenuSelect('orders')}>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem>
            <Typography color="text.secondary" variant="body2">
              Analytics
            </Typography>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setReportsOpen(!reportsOpen)}>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Reports" />
              {reportsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => handleMenuSelect('reports')}>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Sales Reports" />
              </ListItemButton>
            </List>
          </Collapse>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleMenuSelect('profile')}>
              <ListItemIcon>
                <LayersIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {renderContent()}
      </Main>
    </Box>
  );
}
