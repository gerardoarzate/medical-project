
import { BrowserRouter, Routes, Route } from "react-router";
import { IndexPage } from "./routes/IndexPage";
import { LoginPage } from "./routes/LoginPage";
import { ClinicianSignUpPage } from "./routes/ClinicianSignUpPage";
import { PatientSignUpPage } from "./routes/PatientSignUpPage";
import { Layout } from "./routes/Layout";
import { AssistancePage } from "./routes/AssistancePage";
import { CounterpartPage } from './routes/CounterpartPage';
import { ChatPage } from './routes/ChatPage';
import { ProfilePage } from './routes/ProfilePage';
import { useState } from "react";
import { APIContext } from './contexts/APIContext';
const defaultApiUrl = import.meta.env.VITE_API_URL;

export const App = () => {
	const [ apiUrl, setApiUrl ] = useState(defaultApiUrl);
	
    return (
		<APIContext.Provider value={{ apiUrl, setApiUrl }}>
			<BrowserRouter>
				<Routes>
					<Route index element={<IndexPage />} />
					<Route path="login" element={<LoginPage />} />
					<Route path="signup-clinician" element={<ClinicianSignUpPage />} />
					<Route path="signup-patient" element={<PatientSignUpPage />} />
					<Route path="navigation" element={<Layout />}>
						<Route index element={<AssistancePage />} />
						<Route path="assistance" element={<AssistancePage />} />
						<Route path="counterpart" element={<CounterpartPage />} />
						<Route path="chat" element={<ChatPage />} />
						<Route path="profile" element={<ProfilePage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</APIContext.Provider>
    );
};