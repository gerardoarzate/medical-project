import styles from './AssistancePage.module.css';
import { useState } from 'react';
import { RoundedSpecialityHeader } from '../components/RoundedSpecialityHeader';
import { useToken } from '../contexts/TokenContext';
import { useProfile } from '../contexts/ProfileContext';
import { SpecialityHeader } from '../components/SpecialityHeader';
import { Destination } from '../components/Destination';
import { EmergencyDetails } from '../components/EmergencyDetails';
import { Map } from '../components/Map';
import { useEmergencyTypes } from '../contexts/EmergencyTypesContext';
import { PageTitle } from '../components/PageTitle';
import { CardOptionGroup } from '../components/CardOptionGroup';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAssistanceService } from '../contexts/AssistanceServiceContext';
import { useRequest, useCounterpart } from '../hooks/assistanceServiceHooks';

const AvailableClinicianView = ({ profile }) => (
    <>
        <RoundedSpecialityHeader speciality={profile?.speciality} name={profile?.name} />
        <div className={styles.availableClinicianContent}>
            <div className={styles.clinicianAvailabilityContainer}>
                <p>Te encuentras</p>
                <p className={styles.clinicianAvailabilityText}>Disponible</p>
            </div>
            <p className={styles.availableClinicianDescription}>Cuando te sea asignada una solicitud verás los detalles aquí</p>
        </div>
    </>
);

const BusyClinicianView = ({ profile }) => (
    <div className={styles.busyClinicianView}>
        <SpecialityHeader speciality={profile?.speciality} name={profile?.name} />
        <Destination destination={'Av. de las Ciencias, Facultad de Informática UAQ Campus Juriquilla'} />
        <div className={styles.busyClinicianContent}>
            <Map />
            <EmergencyDetails emergencyType={'Tipo de emergencia'.toUpperCase()} reportTimestampInMs={Date.now()} />
        </div>
    </div>
);

const AvailablePatientView = ({ emergencyTypes }) => {
    const [formData, setFormData] = useState({
        selectedType: undefined,
        notes: ''
    });
    const assistanceService = useAssistanceService();

    const handleConfirm = () => {
        const { selectedType, notes } = formData;
        const selectedTypeObj = emergencyTypes.find(type => type.name == selectedType);
        const selectedId = selectedTypeObj.id;
        assistanceService.createRequest({
            emergencyTypeId: selectedId,
            notes: notes,
            initialLatitude: 0,
            initialLongitude: 0
        });
    }

    return (
        <div className={styles.availablePatientView}>
            <PageTitle>Solicitar asistencia médica</PageTitle>
            
            <div className={styles.availablePatientFormLabelContainer}>
                <p className={styles.availablePatientFormLabelTitle}>Tipo de emergencia</p>
                <p>Seleccione el que mejor describa su emergencia</p>
            </div>

            <CardOptionGroup
                options={emergencyTypes.map(type => ({
                    title: type.name,
                    description: type.description
                }))}
                selectedTitle={formData.selectedType}
                onSelect={selectedTitle => setFormData(prev => ({
                    ...prev,
                    selectedType: selectedTitle
                }))}
            />

            <Input
                type='textarea'
                label={'Notas (opcional)'}
                value={formData.notes}
                color={'var(--secondary)'}
                name={'notes'}
                setterFunction={setFormData}
            />

            <Button onClick={handleConfirm}>Confirmar solicitud</Button>
        </div>
    );
};

export const AssistancePage = () => {
    const { tokenData } = useToken();
    const profile = useProfile();
    const emergencyTypes = useEmergencyTypes();
    const request = useRequest();
    const counterpart = useCounterpart();
    
    if (!tokenData) {
        return;
    }
    
    const { type } = tokenData;
    const isWaiting = !!request;
    const isBusy = isWaiting && !!counterpart;

    return (
        <main className={styles.assistancePage}>
            {
                type == 'MEDICO' ? 
                    isBusy ? <BusyClinicianView profile={profile} />
                    : <AvailableClinicianView profile={profile} />
                : type == 'PACIENTE' ?
                    isBusy ? 'busy'
                    : isWaiting ? 'waiting'
                    : <AvailablePatientView emergencyTypes={emergencyTypes} />
                : null
            }
        </main>
    );
}