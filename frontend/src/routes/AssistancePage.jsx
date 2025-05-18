import styles from './AssistancePage.module.css';
import { RoundedSpecialityHeader } from '../components/RoundedSpecialityHeader';
import { useToken } from '../contexts/TokenContext';
import { useProfile } from '../contexts/ProfileContext';
import { SpecialityHeader } from '../components/SpecialityHeader';
import { Destination } from '../components/Destination';
import { EmergencyDetails } from '../components/EmergencyDetails';
import { Map } from '../components/Map';

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

export const AssistancePage = () => {
    const { tokenData } = useToken();
    const profile = useProfile();

    if (!tokenData) {
        return;
    }

    const { type } = tokenData;
    const isBusy = true;

    return (
        <main className={styles.assistancePage}>
            {
                type == 'MEDICO' ? 
                    isBusy ? <BusyClinicianView profile={profile} />
                    : <AvailableClinicianView profile={profile} />
                : type == 'PACIENTE' ?
                    isBusy ? 'busy patient'
                    : 'available patient'
                : null
            }
        </main>
    );
}