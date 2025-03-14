import { useContext } from 'react';
import { SDKStateContext, SDKStateContextType } from './SDKStateContext';

/**
 * Custom hook to access the SDK state
 */
export const useSDKState = (): SDKStateContextType => {
  const state = useContext(SDKStateContext);
  
  if (!state) {
    throw new Error('useSDKState must be used within a SDKProvider');
  }
  
  return state;
}; 