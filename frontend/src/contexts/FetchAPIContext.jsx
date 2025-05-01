import { useContext, createContext } from "react";
import { APIContext } from "./APIContext";

const FetchAPIContext = createContext();

export const FetchAPIProvider = ({ children }) => {
    const { apiUrl } = useContext(APIContext);
    const token = localStorage.getItem('token');

    if (!token) {
        console.log('fetchAPI has been initialized with no token');
    }

    const fetchAPI = async (path, method = 'GET', body, options = {}) => {
        if (!apiUrl) {
            throw new Error("Can't use fetchAPI because apiUrl is not defined");
        }

        const cleanPath = path.replace(/^\//, '');

        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const completeOptions = { 
            ...options,
            method: method.toUpperCase(),
            headers
        };
        
        if (body) {
            completeOptions['body'] = JSON.stringify(body);
        }

        const res = await fetch(`${apiUrl}/${cleanPath}`, completeOptions);

        if (res.ok) {
            const text = await res.text();
            try {
                return JSON.parse(text);
            } catch(error) {
                return text;
            }
        }

        throw new Error(`Unsuccessful request: ${res.status} ${res.statusText}`);
    }

    return (
        <FetchAPIContext.Provider value={fetchAPI}>
            {children}
        </FetchAPIContext.Provider>
    )
};

export const useFetchAPI = () => {
    const fetchAPI = useContext(FetchAPIContext);
    if (!fetchAPI) {
        throw new Error('useFetchAPI must be used within a FetchAPIProvider')
    }
    return fetchAPI;
};