import webdrawSDK from '../sdk/WebdrawSDK';
import { WebdrawSDK } from '../types/types';

/**
 * Service for Webdraw-specific operations.
 * This provides centralized access to the SDK and handles SDK operations.
 */
export class WebdrawService {
  private static instance: WebdrawService | null = null;
  
  private constructor() {
    // No need to initialize anything - SDK is already initialized
  }
  
  /**
   * Get the singleton instance of WebdrawService
   */
  public static getInstance(): WebdrawService {
    if (!WebdrawService.instance) {
      WebdrawService.instance = new WebdrawService();
    }
    
    return WebdrawService.instance;
  }
  
  /**
   * Reset the singleton instance (primarily for testing)
   */
  public static reset(): void {
    WebdrawService.instance = null;
  }
  
  /**
   * Get the WebDraw SDK instance
   */
  public getSDK(): WebdrawSDK {
    return webdrawSDK;
  }
  
  /**
   * Check if the SDK is ready to use
   */
  public async checkSDKAvailability(): Promise<boolean> {
    try {
      const sdk = this.getSDK();
      return await sdk.ready();
    } catch (error) {
      console.error('Error checking SDK availability:', error);
      return false;
    }
  }
  
  /**
   * Get current user information
   */
  public async getUser(): Promise<{ username: string } | null> {
    try {
      const sdk = this.getSDK();
      if (!sdk.isReady()) {
        await sdk.ready();
      }
      return await sdk.getUser();
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }
  
  /**
   * Execute AI object generation
   */
  public async executeAIGenerateObject<T = any>(options: {
    prompt: string;
    schema: {
      type: "object";
      properties: Record<string, any>;
      required?: string[];
    };
    temperature?: number;
  }): Promise<T | null> {
    try {
      const sdk = this.getSDK();
      if (!sdk.isReady()) {
        await sdk.ready();
      }
      
      if (!sdk.ai) {
        throw new Error('AI functionality not available in SDK');
      }
      
      const result = await sdk.ai.generateObject({
        prompt: options.prompt,
        schema: options.schema,
        temperature: options.temperature || 0.7
      });
      
      return result.object as T;
    } catch (error) {
      console.error('Error generating object:', error);
      return null;
    }
  }
} 