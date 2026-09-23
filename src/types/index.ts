export interface Profile {
  id: string;
  full_name: string;
  email: string;
  university: string;
  faculty: string;
  bio: string;
  avatar_url?: string;
  skillcoin_balance: number;
  rating: number;
  sessions_completed: number;
  students_helped: number;
  teaching_skills: string[];
  learning_skills: string[];
  created_at: string;
}

export interface Match {
  matched_user: Profile;
  compatibility_score: number;
  they_teach_you_want: string[];
  you_teach_they_want: string[];
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  other_user: Profile;
  last_message?: string;
  last_message_at?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'earn' | 'spend';
  description: string;
  created_at: string;
}

export interface SessionRecord {
  id: string;
  teacher_id: string;
  learner_id: string;
  skill: string;
  status: 'pending' | 'completed';
  created_at: string;
}

export interface Rating {
  id: string;
  session_id: string;
  from_user_id: string;
  to_user_id: string;
  rating: number;
  review?: string;
  created_at: string;
}
