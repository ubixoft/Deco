import { Model } from '../types/chat';
import { IconType } from '../components/common/Icon';

export const MODEL_ICONS: Record<string, IconType> = {
  'openai': 'openai',
  'anthropic': 'claude',
  'mistral': 'mistral',
  'deepseek': 'deepseek'
};

export const AVAILABLE_MODELS: Model[] = [
  {
    value: 'openai:gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai'
  },
  {
    value: 'openai:gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai'
  },
  {
    value: 'openai:o1-preview',
    name: 'O1 Preview',
    provider: 'openai'
  },
  {
    value: 'openai:o1-mini',
    name: 'O1 Mini',
    provider: 'openai'
  },
  {
    value: 'openai:o1',
    name: 'O1',
    provider: 'openai'
  },
  {
    value: 'openai:o3-mini',
    name: 'O3 Mini',
    provider: 'openai'
  },
  {
    value: 'openai:gpt-4o',
    name: 'GPT-4o',
    provider: 'openai'
  },
  {
    value: 'anthropic:claude-3-5-sonnet-latest',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic'
  },
  {
    value: 'anthropic:claude-3-5-haiku-20241022',
    name: 'Claude 3 Haiku',
    provider: 'anthropic'
  },
  {
    value: 'deepseek:deepseek-chat',
    name: 'Deepseek Chat',
    provider: 'deepseek'
  },
  {
    value: 'mistral:pixtral-large-latest',
    name: 'Pixtral Large',
    provider: 'mistral'
  },
  {
    value: 'mistral:mistral-large-latest',
    name: 'Mistral Large',
    provider: 'mistral'
  },
  {
    value: 'mistral:mistral-small-latest',
    name: 'Mistral Small',
    provider: 'mistral'
  }
]; 