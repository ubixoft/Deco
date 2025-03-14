import { createContext, ReactNode, useContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import { WebdrawSDK } from '../types/types';
import { WebdrawService } from '../services/WebdrawService';
import { sdkReducer, initialState, ActionType } from './SDKReducer';
import { SDKStateContext } from './SDKStateContext';
import { SDKDispatchContext } from './SDKDispatchContext';

/**
 * Type definition for the SDK context with additional methods
 */
export interface SDKContextType {
  // Core state
  sdk: WebdrawSDK | null;
  isSDKAvailable: boolean;
  isLoading: boolean;
  error: Error | null;
  user: { username: string } | null;
  service: WebdrawService;
  // Additional methods
  reloadSDK: () => void;
}

// Create the main context that will be used by components
const SDKContext = createContext<SDKContextType | null>(null);

export const useSDK = (): SDKContextType => {
  const ctx = useContext(SDKContext);
  if (!ctx) {
    throw new Error('useSDK must be used within a SDKProvider');
  }
  return ctx;
};

interface SDKProviderProps {
  children: ReactNode;
}

export const SDKProvider = ({ children }: SDKProviderProps) => {
  const [state, dispatch] = useReducer(sdkReducer, initialState);
  
  // Get service instance
  const webdrawService = WebdrawService.getInstance();
  const sdk = webdrawService.getSDK();
  
  // Initialize the SDK in state
  useEffect(() => {
    if (sdk) {
      dispatch({ type: ActionType.SET_SDK, payload: sdk });
    }
  }, [sdk]);

  /**
   * Reload SDK function
   */
  const reloadSDK = useCallback(() => {
    dispatch({ type: ActionType.INCREMENT_RELOAD_COUNTER });
  }, []);
  
  // Check SDK availability when reload counter changes
  useEffect(() => {
    const checkSDKAvailability = async () => {
      try {
        dispatch({ type: ActionType.SET_LOADING, payload: true });
        const isAvailable = await webdrawService.checkSDKAvailability();
        dispatch({ type: ActionType.SET_SDK_AVAILABLE, payload: isAvailable });
        
        // Only try to load user if SDK is available
        if (isAvailable) {
          const user = await webdrawService.getUser();
          dispatch({ type: ActionType.SET_USER, payload: user });
        }
      } catch (error) {
        dispatch({ 
          type: ActionType.SET_ERROR, 
          payload: error instanceof Error ? error : new Error(String(error)) 
        });
        dispatch({ type: ActionType.SET_SDK_AVAILABLE, payload: false });
      } finally {
        dispatch({ type: ActionType.SET_LOADING, payload: false });
      }
    };
    
    checkSDKAvailability();
  }, [webdrawService, state.reloadCounter]);
  
  // Create the context value with service and SDK references
  const contextValue = useMemo(() => ({
    ...state,
    service: webdrawService,
    reloadSDK
  }), [
    state, 
    webdrawService, 
    reloadSDK
  ]);
  
  // Create state value for SDKStateContext
  const stateValue = useMemo(() => ({
    ...state,
    service: webdrawService,
  }), [state, webdrawService]);
  
  return (
    <SDKStateContext.Provider value={stateValue}>
      <SDKDispatchContext.Provider value={dispatch}>
        <SDKContext.Provider value={contextValue}>
          {children}
        </SDKContext.Provider>
      </SDKDispatchContext.Provider>
    </SDKStateContext.Provider>
  );
}; 