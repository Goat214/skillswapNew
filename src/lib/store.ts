import type { Profile, Conversation, Message, Transaction, SessionRecord, Rating } from '../types';
import { seedProfiles } from '../data/seed';

const KEYS = {
  profiles: 'skillswap_profiles',
  currentUserId: 'skillswap_current_user',
  transactions: 'skillswap_transactions',
  messages: 'skillswap_messages',
  sessions: 'skillswap_sessions',
  ratings: 'skillswap_ratings',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeeded() {
  if (!localStorage.getItem(KEYS.profiles)) {
    write(KEYS.profiles, seedProfiles);
  }
}

export const store = {
  getProfiles(): Profile[] {
    ensureSeeded();
    return read<Profile[]>(KEYS.profiles, []);
  },
  saveProfile(profile: Profile) {
    const profiles = this.getProfiles();
    const idx = profiles.findIndex((p) => p.id === profile.id);
    if (idx >= 0) profiles[idx] = profile;
    else profiles.push(profile);
    write(KEYS.profiles, profiles);
  },
  getProfile(id: string): Profile | undefined {
    return this.getProfiles().find((p) => p.id === id);
  },
  getCurrentUserId(): string | null {
    return localStorage.getItem(KEYS.currentUserId);
  },
  setCurrentUserId(id: string | null) {
    if (id) localStorage.setItem(KEYS.currentUserId, id);
    else localStorage.removeItem(KEYS.currentUserId);
  },

  getTransactions(userId: string): Transaction[] {
    const all = read<Record<string, Transaction[]>>(KEYS.transactions, {});
    return all[userId] ?? [];
  },
  addTransaction(userId: string, tx: Transaction) {
    const all = read<Record<string, Transaction[]>>(KEYS.transactions, {});
    all[userId] = [tx, ...(all[userId] ?? [])];
    write(KEYS.transactions, all);
  },

  getMessages(conversationId: string): Message[] {
    const all = read<Record<string, Message[]>>(KEYS.messages, {});
    return all[conversationId] ?? [];
  },
  addMessage(msg: Message) {
    const all = read<Record<string, Message[]>>(KEYS.messages, {});
    all[msg.conversation_id] = [...(all[msg.conversation_id] ?? []), msg];
    write(KEYS.messages, all);
  },
  // Conversation id is deterministic: sorted pair of user ids joined by '__'
  conversationId(a: string, b: string) {
    return [a, b].sort().join('__');
  },
  getConversations(userId: string): Conversation[] {
    const profiles = this.getProfiles();
    const all = read<Record<string, Message[]>>(KEYS.messages, {});
    const convos: Conversation[] = [];
    Object.keys(all).forEach((cid) => {
      if (!cid.includes(userId)) return;
      const [a, b] = cid.split('__');
      const otherId = a === userId ? b : a;
      const other = profiles.find((p) => p.id === otherId);
      if (!other) return;
      const msgs = all[cid];
      const last = msgs[msgs.length - 1];
      convos.push({
        id: cid,
        other_user: other,
        last_message: last?.message,
        last_message_at: last?.created_at,
      });
    });
    return convos.sort((x, y) => (y.last_message_at ?? '').localeCompare(x.last_message_at ?? ''));
  },
  startConversation(userId: string, otherId: string): string {
    const cid = this.conversationId(userId, otherId);
    const all = read<Record<string, Message[]>>(KEYS.messages, {});
    if (!all[cid]) {
      all[cid] = [];
      write(KEYS.messages, all);
    }
    return cid;
  },

  getSessions(userId: string): SessionRecord[] {
    const all = read<SessionRecord[]>(KEYS.sessions, []);
    return all.filter((s) => s.teacher_id === userId || s.learner_id === userId);
  },
  createSession(session: SessionRecord) {
    const all = read<SessionRecord[]>(KEYS.sessions, []);
    all.push(session);
    write(KEYS.sessions, all);
  },
  completeSession(sessionId: string) {
    const all = read<SessionRecord[]>(KEYS.sessions, []);
    const s = all.find((x) => x.id === sessionId);
    if (!s || s.status === 'completed') return;
    s.status = 'completed';
    write(KEYS.sessions, all);

    const teacher = this.getProfile(s.teacher_id);
    const learner = this.getProfile(s.learner_id);
    if (teacher) {
      teacher.skillcoin_balance += 10;
      teacher.sessions_completed += 1;
      teacher.students_helped += 1;
      this.saveProfile(teacher);
      this.addTransaction(teacher.id, {
        id: crypto.randomUUID(), amount: 10, type: 'earn',
        description: `${s.skill} darsi`, created_at: new Date().toISOString(),
      });
    }
    if (learner) {
      learner.skillcoin_balance = Math.max(0, learner.skillcoin_balance - 10);
      learner.sessions_completed += 1;
      this.saveProfile(learner);
      this.addTransaction(learner.id, {
        id: crypto.randomUUID(), amount: -10, type: 'spend',
        description: `${s.skill} darsi`, created_at: new Date().toISOString(),
      });
    }
  },

  getRatings(userId: string): Rating[] {
    const all = read<Rating[]>(KEYS.ratings, []);
    return all.filter((r) => r.to_user_id === userId);
  },
  addRating(rating: Rating) {
    const all = read<Rating[]>(KEYS.ratings, []);
    all.push(rating);
    write(KEYS.ratings, all);
    const target = this.getProfile(rating.to_user_id);
    if (target) {
      const ratings = [...this.getRatings(rating.to_user_id)];
      const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
      target.rating = Math.round(avg * 10) / 10;
      this.saveProfile(target);
    }
  },
};
