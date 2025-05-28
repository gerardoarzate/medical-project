import { createContext, useContext, useEffect, useState } from 'react';
import { useAPI } from './APIContext';
import { useToken } from './TokenContext';
import { Dialog } from '@capacitor/dialog';
import { ClinicianAssistanceService, PatientAssistanceService, AssistanceService } from '../services/AssistanceService';
import { MessageHistory, AssistanceRequest, Counterpart, MessageListener, RequestListener, PatientListener, ClinicianListener } from '../services/AssistanceService';

interface AssistanceServiceContext {
    assistanceService: AssistanceService | null,
    messages: MessageHistory,
    request: AssistanceRequest | undefined,
    counterpart: Counterpart | undefined
}

const AssistanceServiceContext = createContext<AssistanceServiceContext>({
    assistanceService: null,
    messages: [],
    request: undefined,
    counterpart: undefined
});

export const AssistanceServiceProvider = ({ children }) => {
    const { apiUrl } = useAPI();
    const { token, setToken, tokenData } = useToken();
    const [assistanceService, setAssistanceService] = useState<AssistanceService | null>(null);
    const [messages, setMessages] = useState<MessageHistory>([]);
    const [request, setRequest] = useState<AssistanceRequest | undefined>();
    const [counterpart, setCounterpart] = useState<Counterpart | undefined>();
    
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

    useEffect(() => {
        if (!assistanceService) {
            return;
        }

        const messageListener: MessageListener = messages => setMessages(messages);
        assistanceService.addMessageListener(messageListener);

        const requestListener: RequestListener = request => setRequest(request);
        assistanceService.addRequestListener(requestListener);

        const { type } = tokenData;
        let removeCounterpartListener: () => void = () => {};

        switch (type) {
            case 'MEDICO':
                const patientListener: PatientListener = patient => setCounterpart(patient);
                (assistanceService as ClinicianAssistanceService).addPatientListener(patientListener);
                removeCounterpartListener = () => {
                    (assistanceService as ClinicianAssistanceService).removePatientListener(patientListener);
                }
                break;
            case 'PACIENTE':
                const clinicianListener: ClinicianListener = patient => setCounterpart(patient);
                (assistanceService as PatientAssistanceService).addClinicianListener(clinicianListener);
                removeCounterpartListener = () => {
                    (assistanceService as PatientAssistanceService).removeClinicianListener(clinicianListener);
                }
                break;
        }

        return () => {
            assistanceService.removeMessageListener(messageListener);
            assistanceService.removeRequestListener(requestListener);
            removeCounterpartListener();
        }
    }, [assistanceService]);

    return (
        <AssistanceServiceContext.Provider 
            value={{
                assistanceService,
                messages,
                request,
                counterpart
            }}
        >
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
