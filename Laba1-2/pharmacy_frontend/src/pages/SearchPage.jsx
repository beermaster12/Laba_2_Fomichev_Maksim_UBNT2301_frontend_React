import React, { useState } from 'react';
import {
Container, Typography, Paper, Grid, Button,
Table, TableBody, TableCell, TableHead, TableRow,
TextField, Box, Alert, IconButton
} from '@mui/material';
import { Visibility, Search as SearchIcon, Clear } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { medicineService } from '../api/medicineService';

const SearchPage = () => {
const navigate = useNavigate();
const [filters, setFilters] = useState({
    manufacturer: '',
    min_price: '',
    max_price: '',
});
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [searched, setSearched] = useState(false);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
};

const handleSearch = async () => {
    try {
    setLoading(true);
    setError(null);
    const params = {};
    if (filters.manufacturer) params.manufacturer = filters.manufacturer;
    if (filters.min_price) params.min_price = parseFloat(filters.min_price);
    if (filters.max_price) params.max_price = parseFloat(filters.max_price);
    const response = await medicineService.getAll(params);
    setResults(response.data);
    setSearched(true);
    } catch (err) {
    setError('Ошибка поиска: ' + (err.response?.data?.detail || err.message));
    } finally {
    setLoading(false);
    }
};

const handleReset = () => {
    setFilters({ manufacturer: '', min_price: '', max_price: '' });
    setResults([]);
    setSearched(false);
    setError(null);
};

return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
    <Typography variant="h4" gutterBottom>
        Поиск и фильтрация лекарств
    </Typography>

    <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
        <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12} sm={4}>
            <TextField
            fullWidth
            label="Производитель"
            name="manufacturer"
            value={filters.manufacturer}
            onChange={handleChange}
            placeholder="Например: Pharma"
            />
        </Grid>
        <Grid item xs={6} sm={2}>
            <TextField
            fullWidth
            label="Мин. цена (₽)"
            name="min_price"
            type="number"
            value={filters.min_price}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.01 }}
            />
        </Grid>
        <Grid item xs={6} sm={2}>
            <TextField
            fullWidth
            label="Макс. цена (₽)"
            name="max_price"
            type="number"
            value={filters.max_price}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.01 }}
            />
        </Grid>
        <Grid item xs={6} sm={2}>
            <Button
            variant="contained"
            fullWidth
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={loading}
            >
            {loading ? 'Поиск...' : 'Поиск'}
            </Button>
        </Grid>
        <Grid item xs={6} sm={2}>
            <Button
            variant="outlined"
            fullWidth
            startIcon={<Clear />}
            onClick={handleReset}
            >
            Сброс
            </Button>
        </Grid>
        </Grid>
    </Paper>

    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

    {searched && (
        <Paper>
        <Typography variant="h6" sx={{ p: 2 }}>
            Результаты поиска: {results.length} найдено
        </Typography>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Производитель</TableCell>
                <TableCell align="right">Цена (₽)</TableCell>
                <TableCell align="right">Количество</TableCell>
                <TableCell align="center">Детали</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {results.length === 0 ? (
                <TableRow>
                <TableCell colSpan={6} align="center">
                    Ничего не найдено по заданным критериям
                </TableCell>
                </TableRow>
            ) : (
                results.map((med) => (
                <TableRow key={med.id}>
                    <TableCell>{med.id}</TableCell>
                    <TableCell>{med.name}</TableCell>
                    <TableCell>{med.manufacturer}</TableCell>
                    <TableCell align="right">{med.price.toFixed(2)}</TableCell>
                    <TableCell align="right">{med.quantity}</TableCell>
                    <TableCell align="center">
                    <IconButton
                        color="info"
                        onClick={() => navigate(`/details/${med.id}`)}
                    >
                        <Visibility />
                    </IconButton>
                    </TableCell>
                </TableRow>
                ))
            )}
            </TableBody>
        </Table>
        </Paper>
    )}

    <Box sx={{ mt: 3 }}>
        <Button
        variant="outlined"
        onClick={() => navigate('/')}
        >
        ← Вернуться к списку
        </Button>
    </Box>
    </Container>
);
};

export default SearchPage;