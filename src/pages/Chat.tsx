import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import type { Conversation, Message } from '../types';

export default function Chat() {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!profile) return;
    const convos = store.getConversations(profile.id);
    setConversations(convos);
    if (convos.length && !activeId) setActiveId(convos[0].id);
  }, [profile]);

  useEffect(() => {
    if (activeId) setMessages(store.getMessages(activeId));
  }, [activeId]);

  if (!profile) return null;

  const active = conversations.find((c) => c.id === activeId);

  const send = () => {
    if (!draft.trim() || !activeId) return;
    const msg: Message = {
      id: crypto.randomUUID(),
      conversation_id: activeId,
      sender_id: profile.id,
      message: draft.trim(),
      created_at: new Date().toISOString(),
    };
    store.addMessage(msg);
    setMessages((m) => [...m, msg]);
    setDraft('');
    setConversations(store.getConversations(profile.id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 pb-24">
      <h1 className="text-2xl font-semibold mb-6 px-2">Chat</h1>
      <div className="card grid md:grid-cols-[280px_1fr] h-[70vh] overflow-hidden">
        <div className="border-r border-neutral-800 overflow-y-auto hidden md:block">
          {conversations.length === 0 && (
            <p className="text-neutral-600 text-sm p-4">Hali suhbatlar yo'q. Matches sahifasidan boshlang.</p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full text-left px-4 py-3 border-b border-neutral-900 hover:bg-white/5 transition ${activeId === c.id ? 'bg-white/5' : ''}`}
            >
              <div className="font-medium text-sm">{c.other_user.full_name}</div>
              <div className="text-xs text-neutral-500 truncate">{c.last_message ?? 'Yozishni boshlang'}</div>
            </button>
          ))}
        </div>

        <div className="flex flex-col">
          {active ? (
            <>
              <div className="px-4 py-3 border-b border-neutral-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-sm font-semibold">
                  {active.other_user.full_name.charAt(0)}
                </div>
                <span className="font-medium text-sm">{active.other_user.full_name}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender_id === profile.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${
                      m.sender_id === profile.id ? 'bg-violet-600 text-white' : 'bg-neutral-800 text-neutral-100'
                    }`}>
                      {m.message}
                      <div className="text-[10px] opacity-60 mt-1">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && <p className="text-neutral-600 text-sm">Birinchi xabarni yuboring.</p>}
              </div>
              <div className="p-3 border-t border-neutral-800 flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Xabar yozing..."
                  className="input-field flex-1 px-3 py-2 text-sm"
                />
                <button onClick={send} className="btn-primary px-4 text-sm">Yuborish</button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-600 text-sm">
              Suhbat tanlanmagan
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
