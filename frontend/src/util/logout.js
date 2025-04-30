const logout = ({ redirectTo }) => {
    if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
    }

    if (redirectTo) {
        location.assign(redirectTo);
    }
};

export default logout;