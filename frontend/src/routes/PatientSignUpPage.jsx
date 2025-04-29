import styles from './PatientSignUpPage.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { Input } from '../components/Input';
import { SegmentedControl } from '../components/SegmentedControl';

export const PatientSignUpPage = () => {
    const navigate = useNavigate();
    const sexOptions = ['Masculino', 'Femenino'];
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        curp: '',
        sex: undefined,
        age: '',
        height: '',
        weight: '',
        telephone: '',
        email: '',
        password: ''
    });

    const onConfirm = () => {
        navigate('/navigation/assistance');
    };

    return (
        <main className={styles.patientSignUpPage}>
            <div className={styles.titleContainer}>
                <div className={styles.backButtonContainer}>
                    <BackButton />
                </div>
                <h1 className={styles.title}>Soy paciente</h1>
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
                label='CURP'
                name='curp'
                type='text'
                value={formData.curp}
                setterFunction={setFormData}
            />
            <SegmentedControl
                color='var(--secondary)'
                label='Sexo'
                name='sex'
                value={formData.sex}
                setterFunction={setFormData}
                options={sexOptions}
            />
            <Input
                color='var(--secondary)'
                label='Edad'
                name='age'
                type='number'
                value={formData.age}
                setterFunction={setFormData}
            />
            <Input
                color='var(--secondary)'
                label='Estatura (metros)'
                name='height'
                type='number'
                value={formData.height}
                setterFunction={setFormData}
            />
            <Input
                color='var(--secondary)'
                label='Peso (kg)'
                name='weight'
                type='number'
                value={formData.weight}
                setterFunction={setFormData}
            />
            <Input
                color='var(--secondary)'
                label='Teléfono'
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