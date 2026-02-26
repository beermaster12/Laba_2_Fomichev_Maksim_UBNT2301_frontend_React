import React, { useEffect, useState } from 'react';
import {
Container, Typography, TextField, Button, Paper,
Box, CircularProgress, Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { medicineService } from '../api/medicineService';

const AddEditPage = () => {
const { id } = useParams();
const navigate = useNavigate();
const isEdit = !!id;
const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    price: '',
    quantity: '',
});
const [loading, setLoading] = useState(isEdit);
const [error, setError] = useState(null);
const [submitting, setSubmitting] = useState(false);

useEffect(() => {
    if (isEdit) {
    medicineService.getById(id)
        .then(res => {
        setFormData({
            name: res.data.name,
            manufacturer: res.data.manufacturer,
            price: res.data.price,
            quantity: res.data.quantity,
        });
        })
        .catch(() => setError('Ошибка загрузки данных'))
        .finally(() => setLoading(false));
    }
}, [id, isEdit]);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
    ...formData,
    price: parseFloat(formData.price),
    quantity: parseInt(formData.quantity),
    };

    try {
    if (isEdit) {
        await medicineService.update(id, payload);
    } else {
        await medicineService.create(payload);
    }
    navigate('/');
    } catch (err) {
    setError(err.response?.data?.detail || 'Ошибка при сохранении');
    } finally {
    setSubmitting(false);
    }
};

if (loading) return <CircularProgress sx={{ m: 4 }} />;

return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
    <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
        {isEdit ? 'Редактировать лекарство' : 'Добавить лекарство'}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
            label="Название *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            inputProps={{ minLength: 2 }}
        />
        <TextField
            label="Производитель *"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            required
            inputProps={{ minLength: 2 }}
        />
        <TextField
            label="Цена (Р) *"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            inputProps={{ min: 0.01, step: 0.01 }}
        />
        <TextField
            label="Количество *"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            required
            inputProps={{ min: 0 }}
        />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Сохранение...' : 'Сохранить'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/')} disabled={submitting}>
            Отмена
            </Button>
        </Box>
        </Box>
    </Paper>
    </Container>
);
};

export default AddEditPage;