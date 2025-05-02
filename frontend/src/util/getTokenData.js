export const getTokenData = () => {
    try {
        const encodedToken = localStorage.getItem('token');
        const payload = encodedToken.split('.')[1];
        const decodedPayload = atob(payload);
        const tokenData = JSON.parse(decodedPayload);
        return tokenData;
    } catch(err) {
        return false;
    }
};
