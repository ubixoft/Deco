import { createContext, ReactNode, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { WebdrawSDK } from '../types/types';
import { WebdrawService } from '../services/WebdrawService';

// ============================================================================
// CONTEXT DEFINITIONS
// ============================================================================

// Type definition for the SDK context
export interface SDKContextType {
  sdk: WebdrawSDK | null;
  user: { username: string } | null;
  service: WebdrawService;
  isInitializing: boolean;
  reloadSDK: () => void;
}

// Create the main context that will be used by components
const SDKContext = createContext<SDKContextType | null>(null);

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Hook to use the complete SDK context
 */
export const useSDK = (): SDKContextType => {
  const ctx = useContext(SDKContext);
  if (!ctx) {
    throw new Error('useSDK must be used within a SDKProvider');
  }
  return ctx;
};

// ============================================================================
// SDK PROVIDER COMPONENT
// ============================================================================

interface SDKProviderProps {
  children: ReactNode;
}

// Configuration
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;

export const SDKProvider = ({ children }: SDKProviderProps) => {
  // Get service instance
  const webdrawService = useMemo(() => WebdrawService.getInstance(), []);
  
  // State
  const [sdk, setSDK] = useState<WebdrawSDK | null>(null);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [retryAttempt, setRetryAttempt] = useState<number>(0);

  /**
   * Initialize or reload SDK
   */
  const initializeSDK = useCallback(async () => {
    setIsInitializing(true);
    
    try {
      // Check if SDK is available
      const isAvailable = await webdrawService.checkSDKAvailability();
      
      if (isAvailable) {
        // Get SDK instance
        const sdkInstance = webdrawService.getSDK();
        setSDK(sdkInstance);
        
        // Get user info
        const userInfo = await webdrawService.getUser();
        setUser(userInfo);
        
        // Reset retry count on success
        setRetryAttempt(0);
      } else {
        throw new Error('SDK not available');
      }
    } catch (error) {
      console.error('Failed to initialize SDK:', error);
      
      // Handle retry logic
      if (retryAttempt < MAX_RETRY_ATTEMPTS) {
        console.log(`Will retry SDK initialization (attempt ${retryAttempt + 1} of ${MAX_RETRY_ATTEMPTS})...`);
        setTimeout(() => {
          setRetryAttempt(prev => prev + 1);
        }, RETRY_DELAY_MS);
      }
    } finally {
      // Only set initializing to false if we're done with retries or succeeded
      if (retryAttempt >= MAX_RETRY_ATTEMPTS || sdk) {
        setIsInitializing(false);
      }
    }
  }, [webdrawService, retryAttempt, sdk]);

  // Reload SDK function (exposed to consumers)
  const reloadSDK = useCallback(() => {
    setRetryAttempt(0);
    setSDK(null);
    setUser(null);
  }, []);
  
  // Initialize SDK when component mounts or when retryAttempt changes
  useEffect(() => {
    initializeSDK();
  }, [initializeSDK, retryAttempt]);
  
  // Create the context value
  const contextValue = useMemo(() => ({
    sdk,
    user,
    service: webdrawService,
    isInitializing,
    reloadSDK
  }), [sdk, user, webdrawService, isInitializing, reloadSDK]);
  
  return (
    <SDKContext.Provider value={contextValue}>
      {children}
    </SDKContext.Provider>
  );
}; 