import React, { useEffect, useState } from 'react';
import {
Container, Typography, Table, TableBody, TableCell,
TableHead, TableRow, Paper, Button, IconButton,
CircularProgress, Alert, Box
} from '@mui/material';
import { Edit, Delete, Add, Search, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { medicineService } from '../api/medicineService';

const HomePage = () => {
const [medicines, setMedicines] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const navigate = useNavigate();

const fetchMedicines = async () => {
    try {
    setLoading(true);
    const response = await medicineService.getAll();
    setMedicines(response.data);
    setError(null);
    } catch (err) {
    setError('Ошибка загрузки данных');
    } finally {
    setLoading(false);
    }
};

useEffect(() => {
    fetchMedicines();
}, []);

const handleDelete = async (id) => {
    if (window.confirm('Удалить это лекарство?')) {
    try {
        await medicineService.delete(id);
        fetchMedicines();
    } catch (err) {
        alert('Ошибка при удалении');
    }
    }
};

if (loading) return <CircularProgress sx={{ m: 4 }} />;

return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
    <Typography variant="h4" gutterBottom>
        Аптека - Список лекарств
    </Typography>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => navigate('/add')}
        >
        Добавить лекарство
        </Button>
        <Button
        variant="outlined"
        startIcon={<Search />}
        onClick={() => navigate('/search')}
        >
        Поиск и фильтрация
        </Button>
    </Box>

    <Paper>
        <Table>
        <TableHead>
            <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Производитель</TableCell>
            <TableCell align="right">Цена (Р)</TableCell>
            <TableCell align="right">Количество</TableCell>
            <TableCell align="center">Действия</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {medicines.map((med) => (
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
                <IconButton
                    color="primary"
                    onClick={() => navigate(`/edit/${med.id}`)}
                >
                    <Edit />
                </IconButton>
                <IconButton
                    color="error"
                    onClick={() => handleDelete(med.id)}
                >
                    <Delete />
                </IconButton>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </Paper>
    </Container>
);
};

export default HomePage;