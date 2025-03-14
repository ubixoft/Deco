import React from 'react';

// Define icon types
export type IconType = 
  | 'openai'
  | 'claude'
  | 'mistral'
  | 'deepseek'
  | 'chat'
  | 'plus'
  | 'search'
  | 'trash'
  | 'refresh'
  | 'copy'
  | 'menu'
  | 'close'
  | 'send';

interface IconProps {
  type: IconType;
  className?: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ type, className = '', size = 24 }) => {
  const getIcon = () => {
    switch (type) {
      case 'openai':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
          </svg>
        );
      case 'claude':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.1547 2.01916C11.6991 1.70059 12.3009 1.70059 12.8453 2.01916L21.1453 6.98084C21.6897 7.29941 22 7.87221 22 8.5V15.5C22 16.1278 21.6897 16.7006 21.1453 17.0192L12.8453 21.9808C12.3009 22.2994 11.6991 22.2994 11.1547 21.9808L2.8547 17.0192C2.31027 16.7006 2 16.1278 2 15.5V8.5C2 7.87221 2.31027 7.29941 2.8547 6.98084L11.1547 2.01916Z" />
          </svg>
        );
      case 'mistral':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.5 7L12.5 12V22L4.5 17V7Z" />
            <path d="M20.5 7L12.5 12V22L20.5 17V7Z" />
            <path d="M4.5 7L12.5 2L20.5 7L12.5 12L4.5 7Z" />
          </svg>
        );
      case 'deepseek':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" />
            <path fill="white" d="M7 10.5L12 13.5L17 10.5V14.5L12 17.5L7 14.5V10.5Z" />
            <path fill="white" d="M7 6.5L12 9.5L17 6.5V8.5L12 11.5L7 8.5V6.5Z" />
          </svg>
        );
      case 'chat':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C13.33 22 14.6 21.69 15.77 21.15L21 22L19.54 17.25C20.45 15.72 21 13.93 21 12C21 6.48 16.52 2 12 2ZM8 13H16C16.55 13 17 13.45 17 14C17 14.55 16.55 15 16 15H8C7.45 15 7 14.55 7 14C7 13.45 7.45 13 8 13ZM8 9H13C13.55 9 14 9.45 14 10C14 10.55 13.55 11 13 11H8C7.45 11 7 10.55 7 10C7 9.45 7.45 9 8 9Z" />
          </svg>
        );
      case 'plus':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        );
      case 'search':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'trash':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        );
      case 'refresh':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm1-9h3l-4 4-4-4h3V8h2v3z" />
          </svg>
        );
      case 'copy':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 18h6v-2H9v2zm0-4h6v-2H9v2zm0-4h6V8H9v2zm-4 8V6h1v10H5zm16 2H8V4h13v16zM7 2v16H3V2h4zm17 4V2h-3v4h3zM7 20v-2H5v2h2z" />
          </svg>
        );
      case 'menu':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        );
      case 'close':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'send':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <span className={className} style={{ display: 'inline-flex', width: size, height: size }}>
      {getIcon()}
    </span>
  );
};

export default Icon; 