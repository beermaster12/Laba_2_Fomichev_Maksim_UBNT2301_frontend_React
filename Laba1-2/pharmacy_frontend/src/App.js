import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';

import HomePage from './pages/HomePage';
import AddEditPage from './pages/AddEditPage';
import SearchPage from './pages/SearchPage';
import DetailsPage from './pages/DetailsPage';
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Аптека
            </Typography>
            <Button color="inherit" href="/">Главная</Button>
            <Button color="inherit" href="/search">Поиск</Button>
            <Button color="inherit" href="/add">Добавить</Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<AddEditPage />} />
            <Route path="/edit/:id" element={<AddEditPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/details/:id" element={<DetailsPage />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;