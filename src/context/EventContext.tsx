import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface BarEvent {
  id: number;
  title: string;
  date: string;
  day: string;
  time: string;
  genre: string;
  djs: string[];
  entrance: string;
  featured: boolean;
  imageUrl?: string;
}

interface EventContextType {
  events: BarEvent[];
  loading: boolean;
  addEvent: (event: Omit<BarEvent, 'id'>) => Promise<void>;
  updateEvent: (id: number, event: Omit<BarEvent, 'id'>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  refreshEvents: () => Promise<void>;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// デフォルトのイベントデータ（ローカルモード用）
const defaultEvents: BarEvent[] = [
  {
    id: 1,
    title: 'YU-MI BIRTHDAY BASH',
    date: '2025.12.20',
    day: 'SAT',
    time: '21:00〜',
    genre: 'ALL GENRE',
    djs: ['OB-The-Mitchell', '52ROCK'],
    entrance: 'Check SNS',
    featured: true,
    imageUrl: '',
  },
  {
    id: 2,
    title: 'FRIDAY NIGHT SESSION',
    date: '2025.12.19',
    day: 'FRI',
    time: '21:00〜midnight',
    genre: 'REGGAE / HIP HOP',
    djs: ['AMI', 'GASHIO', 'GON', 'Yun', 'Y.N.O'],
    entrance: 'FREE',
    featured: false,
    imageUrl: '',
  },
  {
    id: 3,
    title: 'DJ GON SPECIAL',
    date: '2025.12.05',
    day: 'FRI',
    time: '22:00〜midnight',
    genre: 'HIP HOP / R&B',
    djs: ['DJ GON'],
    entrance: 'FREE',
    featured: false,
    imageUrl: '',
  },
];

// 管理者パスワード
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'habit2025';

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<BarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('barhabit_auth') === 'true';
  });

  // イベント取得
  const fetchEvents = async () => {
    setLoading(true);
    
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) throw error;
        
        // Supabaseのデータを変換
        const formattedEvents: BarEvent[] = (data || []).map(event => ({
          id: event.id,
          title: event.title,
          date: event.date,
          day: event.day,
          time: event.time,
          genre: event.genre,
          djs: event.djs || [],
          entrance: event.entrance,
          featured: event.featured || false,
          imageUrl: event.image_url || '',
        }));
        
        setEvents(formattedEvents);
      } catch (error) {
        console.error('イベント取得エラー:', error);
        // エラー時はローカルストレージから取得
        const saved = localStorage.getItem('barhabit_events');
        setEvents(saved ? JSON.parse(saved) : defaultEvents);
      }
    } else {
      // ローカルモード
      const saved = localStorage.getItem('barhabit_events');
      setEvents(saved ? JSON.parse(saved) : defaultEvents);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ローカルモード時のローカルストレージ保存
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      localStorage.setItem('barhabit_events', JSON.stringify(events));
    }
  }, [events]);

  const addEvent = async (eventData: Omit<BarEvent, 'id'>) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('events')
          .insert([{
            title: eventData.title,
            date: eventData.date,
            day: eventData.day,
            time: eventData.time,
            genre: eventData.genre,
            djs: eventData.djs,
            entrance: eventData.entrance,
            featured: eventData.featured,
            image_url: eventData.imageUrl,
          }]);
        
        if (error) throw error;
        await fetchEvents();
      } catch (error) {
        console.error('イベント追加エラー:', error);
        throw error;
      }
    } else {
      // ローカルモード
      const newId = Math.max(...events.map(e => e.id), 0) + 1;
      setEvents([...events, { ...eventData, id: newId }]);
    }
  };

  const updateEvent = async (id: number, eventData: Omit<BarEvent, 'id'>) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('events')
          .update({
            title: eventData.title,
            date: eventData.date,
            day: eventData.day,
            time: eventData.time,
            genre: eventData.genre,
            djs: eventData.djs,
            entrance: eventData.entrance,
            featured: eventData.featured,
            image_url: eventData.imageUrl,
          })
          .eq('id', id);
        
        if (error) throw error;
        await fetchEvents();
      } catch (error) {
        console.error('イベント更新エラー:', error);
        throw error;
      }
    } else {
      // ローカルモード
      setEvents(events.map(event => 
        event.id === id ? { ...eventData, id } : event
      ));
    }
  };

  const deleteEvent = async (id: number) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        await fetchEvents();
      } catch (error) {
        console.error('イベント削除エラー:', error);
        throw error;
      }
    } else {
      // ローカルモード
      setEvents(events.filter(event => event.id !== id));
    }
  };

  const refreshEvents = async () => {
    await fetchEvents();
  };

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('barhabit_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('barhabit_auth');
  };

  return (
    <EventContext.Provider value={{
      events,
      loading,
      addEvent,
      updateEvent,
      deleteEvent,
      refreshEvents,
      isAuthenticated,
      login,
      logout,
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
