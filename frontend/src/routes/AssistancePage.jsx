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
    const { token } = useToken();
    const profile = useProfile();

    return (
        <main>
            <AvailableClinicianView profile={profile} />
        </main>
    );
}