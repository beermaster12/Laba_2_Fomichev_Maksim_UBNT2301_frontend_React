import React, { useState } from 'react';
import { Box, TextField, Button, Grid, Paper } from '@mui/material';

const SearchFilter = ({ onSearch }) => {
const [filters, setFilters] = useState({
    manufacturer: '',
    min_price: '',
    max_price: '',
});

const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
};

const handleSearch = () => {
    const params = {};
    if (filters.manufacturer) params.manufacturer = filters.manufacturer;
    if (filters.min_price) params.min_price = parseFloat(filters.min_price);
    if (filters.max_price) params.max_price = parseFloat(filters.max_price);
    onSearch(params);
};

const handleReset = () => {
    setFilters({ manufacturer: '', min_price: '', max_price: '' });
    onSearch({});
};

return (
    <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
    <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12} sm={4}>
        <TextField
            fullWidth
            label="Производитель"
            name="manufacturer"
            value={filters.manufacturer}
            onChange={handleChange}
        />
        </Grid>
        <Grid item xs={6} sm={2}>
        <TextField
            fullWidth
            label="Мин. цена"
            name="min_price"
            type="number"
            value={filters.min_price}
            onChange={handleChange}
        />
        </Grid>
        <Grid item xs={6} sm={2}>
        <TextField
            fullWidth
            label="Макс. цена"
            name="max_price"
            type="number"
            value={filters.max_price}
            onChange={handleChange}
        />
        </Grid>
        <Grid item xs={6} sm={2}>
        <Button variant="contained" fullWidth onClick={handleSearch}>
            Поиск
        </Button>
        </Grid>
        <Grid item xs={6} sm={2}>
        <Button variant="outlined" fullWidth onClick={handleReset}>
            Сброс
        </Button>
        </Grid>
    </Grid>
    </Paper>
);
};

export default SearchFilter;