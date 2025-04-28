import styles from './ClinicianSignUpPage.module.css';
import { BackButton } from '../components/BackButton';
import { Input } from '../components/Input';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Select } from '../components/Select';

export const ClinicianSignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        licence: '',
        speciality: '',
        telephone: '',
        email: '',
        password: ''
    });

    const onConfirm = () => {
        console.log(formData);
        navigate('/navigation/assistance');
    };

    return (
        <main className={styles.clinicianSignUpPage}>
            <div className={styles.titleContainer}>
                <div className={styles.backButtonContainer}>
                    <BackButton />
                </div>
                <h1 className={styles.title}>Soy médico</h1>
            </div>

            <Input
                color='var(--secondary)'
                label='Nombre(s)'
                name='name'
                type='text'
                value={formData.name}
                setterFunction={setFormData}
            />
            <Input
                color='var(--secondary)'
                label='Apellido(s)'
                name='lastName'
                type='text'
                value={formData.lastName}
                setterFunction={setFormData}
            />
            <Input
                color='var(--secondary)'
                label='Cédula profesional'
                name='licence'
                type='text'
                value={formData.licence}
                setterFunction={setFormData}
            />
            <Select
                color='var(--secondary)'
                label='Especialidad'
                name='speciality'
                value={formData.speciality}
                setterFunction={setFormData}
                options={[
                    'Opción 1',
                    'Opción 2',
                    'Opción 3'
                ]}
            />
            <Input
                color='var(--secondary)'
                label='Número telefónico'
                name='telephone'
                type='text'
                value={formData.telephone}
                setterFunction={setFormData}
            />
            <Input
                color='var(--secondary)'
                label='Correo electrónico'
                name='email'
                type='email'
                value={formData.email}
                setterFunction={setFormData}
            />
            <Input
                color='var(--secondary)'
                label='Contraseña'
                name='password'
                type='password'
                value={formData.password}
                setterFunction={setFormData}
            />

            <Button onClick={onConfirm}>
                Confirmar
            </Button>
        </main>
    );
}