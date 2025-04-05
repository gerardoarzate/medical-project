import { Outlet } from 'react-router';
import styles from './Layout.module.css';

export const Layout = () => {
    return (
        <>
            <h2>Layout</h2>
            <Outlet />
        </>
    );
}