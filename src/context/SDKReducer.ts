import { WebdrawSDK } from '../types/types';

export enum ActionType {
  SET_SDK = 'SET_SDK',
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR',
  SET_SDK_AVAILABLE = 'SET_SDK_AVAILABLE',
  SET_USER = 'SET_USER',
  INCREMENT_RELOAD_COUNTER = 'INCREMENT_RELOAD_COUNTER',
}

export interface SDKState {
  sdk: WebdrawSDK | null;
  isLoading: boolean;
  error: Error | null;
  isSDKAvailable: boolean;
  user: { username: string } | null;
  reloadCounter: number;
}

export interface SDKAction {
  type: ActionType;
  payload?: any;
}

export const initialState: SDKState = {
  sdk: null,
  isLoading: true,
  error: null,
  isSDKAvailable: false,
  user: null,
  reloadCounter: 0,
};

export const sdkReducer = (state: SDKState, action: SDKAction): SDKState => {
  switch (action.type) {
    case ActionType.SET_SDK:
      return {
        ...state,
        sdk: action.payload,
      };
    case ActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case ActionType.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case ActionType.SET_SDK_AVAILABLE:
      return {
        ...state,
        isSDKAvailable: action.payload,
      };
    case ActionType.SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case ActionType.INCREMENT_RELOAD_COUNTER:
      return {
        ...state,
        reloadCounter: state.reloadCounter + 1,
      };
    default:
      return state;
  }
}; 