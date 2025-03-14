import { createContext } from 'react';
import { WebdrawSDK } from '../types/types';
import { SDKState, initialState } from './SDKReducer';
import { WebdrawService } from '../services/WebdrawService';

// Type definition that extends SDKState with service and sdk
export interface SDKStateContextType extends SDKState {
  service: WebdrawService;
}

// Create the context with a default value
export const SDKStateContext = createContext<SDKStateContextType>({
  ...initialState,
  service: WebdrawService.getInstance(),
}); 