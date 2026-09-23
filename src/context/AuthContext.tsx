import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { isLiveMode, supabase } from '../lib/supabase';
import { store } from '../lib/store';
import type { Profile } from '../types';

interface RegisterInput {
  full_name: string;
  email: string;
  password: string;
  university: string;
  faculty: string;
}

interface AuthContextValue {
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (input: RegisterInput) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => void;
  updateProfile: (patch: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = () => {
    const id = store.getCurrentUserId();
    if (id) setProfile(store.getProfile(id) ?? null);
    else setProfile(null);
  };

  useEffect(() => {
    if (isLiveMode && supabase) {
      const client = supabase;
      client.auth.getSession().then(async ({ data }) => {
        if (data.session?.user) {
          const { data: row } = await client
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
          if (row) setProfile(row as Profile);
        }
        setLoading(false);
      });
      const { data: sub } = client.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: row } = await client
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile((row as Profile) ?? null);
        } else {
          setProfile(null);
        }
      });
      return () => sub.subscription.unsubscribe();
    } else {
      refreshProfile();
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (isLiveMode && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return {};
    }
    // Demo mode: any password works; match by email against known profiles.
    const found = store.getProfiles().find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (!found) return { error: "Bu email bilan foydalanuvchi topilmadi. Ro'yxatdan o'ting." };
    store.setCurrentUserId(found.id);
    setProfile(found);
    return {};
  };

  const register = async (input: RegisterInput) => {
    if (isLiveMode && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      });
      if (error) return { error: error.message };
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: input.full_name,
          email: input.email,
          university: input.university,
          faculty: input.faculty,
          bio: '',
          skillcoin_balance: 50,
          rating: 0,
          sessions_completed: 0,
          students_helped: 0,
        });
      }
      return {};
    }
    // Demo mode
    const existing = store.getProfiles().find((p) => p.email.toLowerCase() === input.email.toLowerCase());
    if (existing) return { error: 'Bu email allaqachon ro\'yxatdan o\'tgan.' };
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      full_name: input.full_name,
      email: input.email,
      university: input.university,
      faculty: input.faculty,
      bio: '',
      skillcoin_balance: 50,
      rating: 0,
      sessions_completed: 0,
      students_helped: 0,
      teaching_skills: [],
      learning_skills: [],
      created_at: new Date().toISOString(),
    };
    store.saveProfile(newProfile);
    store.setCurrentUserId(newProfile.id);
    store.addTransaction(newProfile.id, {
      id: crypto.randomUUID(),
      amount: 50,
      type: 'earn',
      description: "Ro'yxatdan o'tish bonusi",
      created_at: new Date().toISOString(),
    });
    setProfile(newProfile);
    return {};
  };

  const logout = async () => {
    if (isLiveMode && supabase) {
      await supabase.auth.signOut();
    } else {
      store.setCurrentUserId(null);
    }
    setProfile(null);
  };

  const updateProfile = (patch: Partial<Profile>) => {
    if (!profile) return;
    const updated = { ...profile, ...patch };
    setProfile(updated);
    if (isLiveMode && supabase) {
      supabase.from('profiles').update(patch).eq('id', profile.id);
    } else {
      store.saveProfile(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ profile, loading, login, register, logout, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
