import React, { useEffect, useState } from 'react';
import {
Container, Typography, Paper, Box, Button,
CircularProgress, Alert, Grid, Divider
} from '@mui/material';
import { ArrowBack, Edit, Delete } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { medicineService } from '../api/medicineService';

const DetailsPage = () => {
const { id } = useParams();
const navigate = useNavigate();
const [medicine, setMedicine] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    const fetchDetails = async () => {
    try {
        setLoading(true);
        const response = await medicineService.getById(id);
        setMedicine(response.data);
        setError(null);
    } catch (err) {
        setError('Ошибка загрузки данных: ' + (err.response?.data?.detail || err.message));
    } finally {
        setLoading(false);
    }
    };
    fetchDetails();
}, [id]);

const handleDelete = async () => {
    if (window.confirm('Удалить это лекарство?')) {
    try {
        await medicineService.delete(id);
        navigate('/');
    } catch (err) {
        alert('Ошибка при удалении');
    }
    }
};

if (loading) return <CircularProgress sx={{ m: 4 }} />;

if (error) {
    return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/')}>
        Назад к списку
        </Button>
    </Container>
    );
}

return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mr: 2 }}
        >
        Назад
        </Button>
        <Typography variant="h4">
        Детали лекарства
        </Typography>
    </Box>

    <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={3}>
        <Grid item xs={12}>
            <Typography variant="h6" color="primary">
            {medicine.name}
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Divider />
        </Grid>

        <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
            ID
            </Typography>
            <Typography variant="body1">
            {medicine.id}
            </Typography>
        </Grid>

        <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
            Производитель
            </Typography>
            <Typography variant="body1">
            {medicine.manufacturer}
            </Typography>
        </Grid>

        <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
            Цена
            </Typography>
            <Typography variant="body1" color="success.main">
            {medicine.price.toFixed(2)} ₽
            </Typography>
        </Grid>

        <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
            Количество на складе
            </Typography>
            <Typography variant="body1">
            {medicine.quantity} шт.
            </Typography>
        </Grid>

        <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => navigate(`/edit/${medicine.id}`)}
            >
                Редактировать
            </Button>
            <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDelete}
            >
                Удалить
            </Button>
            </Box>
        </Grid>
        </Grid>
    </Paper>
    </Container>
);
};

export default DetailsPage;