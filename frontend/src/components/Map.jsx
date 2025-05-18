import styles from './Map.module.css';
import placeholder from '../assets/placeholder-map.png';

export const Map = () => {
    return (
        <img className={styles.map} src={placeholder} />
    );
}