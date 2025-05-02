import styles from './LogOutButton.module.css';
import { logout } from '../util/logout';

export const LogOutButton = ({ children }) => {
    return (
        <p
            className={styles.logOutButton}
            onClick={()=> logout({ redirectTo: '/' })}
        >
            {children || 'Cerrar sesión'}
        </p>
    );
}