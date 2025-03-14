// @ts-ignore
import { SDK } from "https://webdraw.com/webdraw-sdk@v1";
import { WebdrawSDK, AIInterface, FileSystemInterface } from '../types/types.ts';

/**
 * WebdrawSDK implementation that directly wraps the SDK from webdraw.com
 */
class WebdrawSDKWrapper implements WebdrawSDK {
  public readonly fs: FileSystemInterface;
  public readonly ai: AIInterface;
  private _ready: boolean = false;
  private _readyPromise: Promise<boolean>;
  
  constructor() {
    // Initialize with placeholder objects that will be replaced when SDK is ready
    this.fs = {} as FileSystemInterface;
    this.ai = {} as AIInterface;
    
    // Create a promise that resolves when the SDK is ready
    this._readyPromise = new Promise<boolean>((resolve) => {
      // Check if SDK is already loaded
      if (typeof SDK !== 'undefined' && SDK.fs && SDK.ai) {
        this._initializeSDK();
        resolve(true);
      } else {
        // Set up an interval to check for SDK availability
        const checkInterval = setInterval(() => {
          if (typeof SDK !== 'undefined' && SDK.fs && SDK.ai) {
            clearInterval(checkInterval);
            this._initializeSDK();
            resolve(true);
          }
        }, 100);
        
        // Set a timeout to fail gracefully if SDK doesn't load in reasonable time
        setTimeout(() => {
          clearInterval(checkInterval);
          console.error('WebdrawSDK failed to load within timeout');
          resolve(false);
        }, 10000); // 10 second timeout
      }
    });
  }
  
  /**
   * Initialize SDK properties once the SDK is loaded
   */
  private _initializeSDK(): void {
    // Ensure we don't try to use SDK before it's available
    if (typeof SDK === 'undefined') {
      throw new Error('WebdrawSDK not available');
    }
    
    // Replace placeholder objects with actual SDK interfaces
    Object.defineProperty(this, 'fs', { value: SDK.fs });
    Object.defineProperty(this, 'ai', { value: SDK.ai });
    
    // Mark SDK as ready
    this._ready = true;
    console.log('WebdrawSDK initialized successfully');
  }
  
  /**
   * Check if the SDK is ready to use
   */
  public isReady(): boolean {
    return this._ready;
  }
  
  /**
   * Get a promise that resolves when the SDK is ready to use
   */
  public ready(): Promise<boolean> {
    return this._readyPromise;
  }
  
  /**
   * Get current user information
   */
  public async getUser(): Promise<{ username: string } | null> {
    await this.ready();
    return SDK.getUser();
  }
  
  /**
   * Redirect to login page
   */
  public async redirectToLogin(options?: { appReturnUrl?: string }): Promise<void> {
    await this.ready();
    SDK.redirectToLogin(options);
  }
  
  /**
   * Simple hello function for testing connection
   */
  public async hello(): Promise<string> {
    await this.ready();
    return SDK.hello ? SDK.hello() : 'WebdrawSDK ready';
  }
  
  // Legacy methods (deprecated)
  public async imageVariation(...args: any[]): Promise<any> {
    await this.ready();
    return SDK.imageVariation?.apply(SDK, args);
  }
  
  public async upscaleImage(...args: any[]): Promise<any> {
    await this.ready();
    return SDK.upscaleImage?.apply(SDK, args);
  }
  
  public async removeBackground(...args: any[]): Promise<any> {
    await this.ready();
    return SDK.removeBackground?.apply(SDK, args);
  }
}

// Export a single instance of the SDK
const webdrawSDK = new WebdrawSDKWrapper();
export default webdrawSDK; 