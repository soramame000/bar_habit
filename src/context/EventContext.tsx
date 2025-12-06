import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  addEvent: (event: Omit<BarEvent, 'id'>) => void;
  updateEvent: (id: number, event: Omit<BarEvent, 'id'>) => void;
  deleteEvent: (id: number) => void;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// デフォルトのイベントデータ
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

// 管理者パスワード（実際の運用では環境変数やバックエンドで管理）
const ADMIN_PASSWORD = 'habit2025';

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<BarEvent[]>(() => {
    const saved = localStorage.getItem('barhabit_events');
    return saved ? JSON.parse(saved) : defaultEvents;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('barhabit_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('barhabit_events', JSON.stringify(events));
  }, [events]);

  const addEvent = (eventData: Omit<BarEvent, 'id'>) => {
    const newId = Math.max(...events.map(e => e.id), 0) + 1;
    setEvents([...events, { ...eventData, id: newId }]);
  };

  const updateEvent = (id: number, eventData: Omit<BarEvent, 'id'>) => {
    setEvents(events.map(event => 
      event.id === id ? { ...eventData, id } : event
    ));
  };

  const deleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
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
      addEvent,
      updateEvent,
      deleteEvent,
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

