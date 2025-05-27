import { useState, useEffect } from "react";
import { useAssistanceService } from "../contexts/AssistanceServiceContext";
import { MessageHistory, MessageListener, AssistanceRequest, RequestListener, Counterpart, ClinicianListener, PatientListener, PatientAssistanceService, ClinicianAssistanceService } from "../services/AssistanceService";
import { useToken } from "../contexts/TokenContext";

export const useMessages = () => {
    const assistanceService = useAssistanceService();
    const [messages, setMessages] = useState<MessageHistory>([]);

    useEffect(() => {
        if (!assistanceService) {
            return;
        }

        const listener: MessageListener = messages => setMessages(messages);
        assistanceService.addMessageListener(listener);

        return () => assistanceService.removeMessageListener(listener);
    }, [assistanceService]);

    return messages;
}

export const useRequest = () => {
    const assistanceService = useAssistanceService();
    const [request, setRequest] = useState<AssistanceRequest | undefined>();

    useEffect(() => {
        if (!assistanceService) {
            return;
        }

        const listener: RequestListener = request => setRequest(request);
        assistanceService.addRequestListener(listener);

        return () => assistanceService.removeRequestListener(listener);
    }, [assistanceService]);

    return request;
}

export const useCounterpart = () => {
    const assistanceService = useAssistanceService();
    const { tokenData } = useToken();
    const [counterpart, setCounterpart] = useState<Counterpart | undefined>();

    useEffect(() => {
        if (!assistanceService) {
            return;
        }

        const { type } = tokenData;

        switch(type) {
            case 'MEDICO':
                const patientListener: PatientListener = patient => setCounterpart(patient);
                (assistanceService as ClinicianAssistanceService).addPatientListener(patientListener);
                return () => (assistanceService as ClinicianAssistanceService).removePatientListener(patientListener);
                
            case 'PACIENTE':
                const clinicianListener: ClinicianListener = patient => setCounterpart(patient);
                (assistanceService as PatientAssistanceService).addClinicianListener(clinicianListener);
                return () => (assistanceService as PatientAssistanceService).removeClinicianListener(clinicianListener);
                
        }

    }, [assistanceService]);

    return counterpart;
}