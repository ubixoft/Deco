import { createContext, Dispatch } from 'react';
import { SDKAction } from './SDKReducer';

// Create a context for dispatching actions
export const SDKDispatchContext = createContext<Dispatch<SDKAction>>(() => undefined); 