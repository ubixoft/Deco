import { useContext } from 'react';
import { SDKDispatchContext } from './SDKDispatchContext';

/**
 * Custom hook to access the SDK dispatch function
 */
export const useSDKDispatch = () => {
  const dispatch = useContext(SDKDispatchContext);
  
  if (!dispatch) {
    throw new Error('useSDKDispatch must be used within a SDKProvider');
  }
  
  return dispatch;
}; 