import { createContext, useContext, useEffect, useState } from 'react';
import { useAPI } from './APIContext';
import { useToken } from './TokenContext';
import { Dialog } from '@capacitor/dialog';
import { ClinicianAssistanceService, PatientAssistanceService, AssistanceService } from '../services/AssistanceService';

const AssistanceServiceContext = createContext<AssistanceService | null>(null);

export const AssistanceServiceProvider = ({ children }) => {
    const { apiUrl } = useAPI();
    const { token, setToken, tokenData } = useToken();
    const [assistanceService, setAssistanceService] = useState<AssistanceService | null>(null);
    
    useEffect(() => {
        if (!token && assistanceService) {
            assistanceService.end();
            setAssistanceService(null);
        }

        if (token && !assistanceService) {
            try {
                switch (tokenData?.type) {
                    case 'MEDICO':
                        setAssistanceService(new ClinicianAssistanceService(apiUrl, token, 0, 0));
                        break;
                    case 'PACIENTE':
                        setAssistanceService(new PatientAssistanceService(apiUrl, token, 0, 0));
                        break;
                }
            } catch (error) {
                console.log(`Unable to instanciate AssistanceService: ${error.message}`);
                Dialog.alert({
                    title: 'Ocurrió un error',
                    message: 'No ha sido posible conectar con el servidor, por favor, vuelve a iniciar sesión.'
                }).then(() => {
                    setToken(undefined);
                });
            }
        }
    }, [ token, tokenData ]);

    return (
        <AssistanceServiceContext.Provider value={assistanceService}>
            {children}
        </AssistanceServiceContext.Provider>
    );
}

export const useAssistanceService = () => {
    const assistanceService = useContext(AssistanceServiceContext);
    if (assistanceService === undefined) {
        throw new Error('useAssistanceService must be used within a AssistanceServiceProvider');
    }
    return assistanceService;
}
