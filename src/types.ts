export interface Crisis {
  id: string;
  title: string;
  dueInMinutes: number;
  urgency: 'critical' | 'high' | 'medium';
  fileAttachment: string;
  description: string;
  category: string;
}

export interface AgentStep {
  id: number;
  agent: string;
  label: string;
  status: 'pending' | 'active' | 'complete';
  content: string;
}

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
  streak: number;
  linkedTo: string;
}

export type AlertTone = 'tactical' | 'lofi' | 'synthetic';
