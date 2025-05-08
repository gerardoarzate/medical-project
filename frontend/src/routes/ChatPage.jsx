import styles from './ChatPage.module.css';
import { useToken } from '../contexts/TokenContext';

const AvailableClinicianView = () => (
    <div className={styles.availableClinicianView}>
        <p className={styles.availableClinicianText}>Cuando te sea asignada una solicitud podrás comunicarte con el paciente aquí</p>
    </div>
)

const AvailablePatientView = () => (
    <div className={styles.availablePatientView}>
        <p className={styles.availablePatientText}>Cuando te sea asignado un médico podrás comunicarte con él aquí</p>
    </div>
)

export const ChatPage = () => {
    const { tokenData } = useToken();
    
    if (!tokenData) {
        return;
    }

    const { type } = tokenData;
    const isBusy = false;

    return (
        <main className={styles.chatPage}>
            {
                type == 'MEDICO' ? 
                    isBusy ? 'busy clinician'
                    : <AvailableClinicianView />
                : type == 'PACIENTE' ?
                    isBusy ? 'busy patient'
                    : <AvailablePatientView />
                : null
            }
        </main>
    );
}