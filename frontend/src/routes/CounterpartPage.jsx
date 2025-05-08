import styles from './CounterpartPage.module.css';
import { useToken } from '../contexts/TokenContext';

const AvailableClinicianView = () => (
    <div className={styles.availableClinicianView}>
        <p className={styles.availableClinicianText}>Cuando te sea asignada una solicitud podrás ver los datos del paciente aquí</p>
    </div>
)

const AvailablePatientView = () => (
    <div className={styles.availablePatientView}>
        <p className={styles.availablePatientText}>Cuando te sea asignado un médico podrás ver sus datos aquí</p>
    </div>
)


export const CounterpartPage = () => {
    const { tokenData } = useToken();

    if (!tokenData) {
        return;
    }

    const { type } = tokenData;
    const isBusy = false;

    return (
        <main className={styles.counterpartPage}>
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