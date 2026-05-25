export interface LeadData {
  name: string;
  phone: string;
  work: string;
  time: string;
}

export interface SignupData {
  name: string;
  email: string;
  password?: string;
}

export interface MessageData {
  role: 'user' | 'ai';
  text: string;
}
