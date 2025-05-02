export const logout = ({ redirectTo }) => {
    if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
    }

    if (redirectTo) {
        location.assign(redirectTo);
    }
};
