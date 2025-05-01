import { createContext } from "react";

export const APIContext = createContext({ apiUrl: '', setApiUrl: value => {} });