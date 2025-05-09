import styles from './AssistancePage.module.css';
import { RoundedSpecialityHeader } from '../components/RoundedSpecialityHeader';
import { useToken } from '../contexts/TokenContext';
import { useProfile } from '../contexts/ProfileContext';

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

export const AssistancePage = () => {
    const { tokenData } = useToken();
    const profile = useProfile();

    if (!tokenData) {
        return;
    }

    const { type } = tokenData;
    const isBusy = false;

    return (
        <main className={styles.assistancePage}>
            {
                type == 'MEDICO' ? 
                    isBusy ? 'busy clinician'
                    : <AvailableClinicianView profile={profile} />
                : type == 'PACIENTE' ?
                    isBusy ? 'busy patient'
                    : 'available patient'
                : null
            }
        </main>
    );
}