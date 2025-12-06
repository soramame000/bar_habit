import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  Calendar, 
  Music, 
  Star,
  X,
  Save,
  ArrowLeft,
  Image
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import type { BarEvent } from '../context/EventContext';
import './Admin.css';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

interface EventFormData {
  title: string;
  date: string;
  day: string;
  time: string;
  genre: string;
  djs: string;
  entrance: string;
  featured: boolean;
  imageUrl: string;
}

const initialFormData: EventFormData = {
  title: '',
  date: '',
  day: 'FRI',
  time: '21:00〜',
  genre: '',
  djs: '',
  entrance: 'FREE',
  featured: false,
  imageUrl: '',
};

export default function Admin() {
  const { events, addEvent, updateEvent, deleteEvent, isAuthenticated, logout } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<BarEvent | null>(null);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // 認証されていない場合はログインページへリダイレクト
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleOpenModal = (event?: BarEvent) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        date: event.date.replace(/\./g, '-'),
        day: event.day,
        time: event.time,
        genre: event.genre,
        djs: event.djs.join(', '),
        entrance: event.entrance,
        featured: event.featured,
        imageUrl: event.imageUrl || '',
      });
    } else {
      setEditingEvent(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setFormData(initialFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      title: formData.title,
      date: formData.date.replace(/-/g, '.'),
      day: formData.day,
      time: formData.time,
      genre: formData.genre,
      djs: formData.djs.split(',').map(dj => dj.trim()).filter(dj => dj),
      entrance: formData.entrance,
      featured: formData.featured,
      imageUrl: formData.imageUrl,
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }

    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    deleteEvent(id);
    setDeleteConfirm(null);
  };

  // 日付でソート
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date.replace(/\./g, '-'));
    const dateB = new Date(b.date.replace(/\./g, '-'));
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <Link to="/" className="admin-back">
              <ArrowLeft size={20} />
            </Link>
            <div className="admin-logo">
              <svg viewBox="0 0 60 60" className="admin-logo-svg">
                <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 22 C25 18, 35 18, 40 22 L40 30 C35 34, 25 34, 20 30 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M25 30 L25 42 M35 30 L35 42" stroke="currentColor" strokeWidth="2"/>
                <path d="M22 38 L30 44 L38 38" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>BAR Habit</span>
            </div>
            <span className="admin-badge">ADMIN</span>
          </div>
          <button className="admin-logout" onClick={logout}>
            <LogOut size={18} />
            ログアウト
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-container">
          {/* Page Title */}
          <div className="admin-title-section">
            <div>
              <h1>イベント管理</h1>
              <p>イベントの追加・編集・削除ができます</p>
            </div>
            <button className="btn-add" onClick={() => handleOpenModal()}>
              <Plus size={20} />
              新規イベント
            </button>
          </div>

          {/* Stats */}
          <div className="admin-stats">
            <div className="stat-card">
              <Calendar size={24} />
              <div className="stat-info">
                <span className="stat-value">{events.length}</span>
                <span className="stat-label">登録イベント数</span>
              </div>
            </div>
            <div className="stat-card">
              <Star size={24} />
              <div className="stat-info">
                <span className="stat-value">{events.filter(e => e.featured).length}</span>
                <span className="stat-label">注目イベント</span>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="admin-events">
            <h2>イベント一覧</h2>
            {sortedEvents.length === 0 ? (
              <div className="admin-empty">
                <Music size={48} />
                <p>イベントがまだ登録されていません</p>
                <button className="btn-add-small" onClick={() => handleOpenModal()}>
                  <Plus size={18} />
                  最初のイベントを追加
                </button>
              </div>
            ) : (
              <div className="admin-events-list">
                {sortedEvents.map((event) => (
                  <div key={event.id} className={`admin-event-card ${event.featured ? 'featured' : ''} ${event.imageUrl ? 'has-image' : ''}`}>
                    {event.featured && <span className="featured-badge">FEATURED</span>}
                    {event.imageUrl ? (
                      <div className="admin-event-image">
                        <img src={event.imageUrl} alt={event.title} />
                      </div>
                    ) : (
                      <div className="admin-event-image">
                        <div className="admin-event-image-placeholder">
                          <Image size={24} />
                        </div>
                      </div>
                    )}
                    <div className="admin-event-date">
                      <span className="date-num">{event.date.split('.')[2]}</span>
                      <span className="date-month">{event.date.split('.')[1]}月</span>
                      <span className="date-day">{event.day}</span>
                    </div>
                    <div className="admin-event-info">
                      <h3>{event.title}</h3>
                      <div className="admin-event-meta">
                        <span>{event.time}</span>
                        <span className="genre-tag">{event.genre}</span>
                      </div>
                      <p className="admin-event-djs">DJ: {event.djs.join(' / ')}</p>
                      <p className="admin-event-entrance">ENTRANCE: {event.entrance}</p>
                    </div>
                    <div className="admin-event-actions">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleOpenModal(event)}
                        title="編集"
                      >
                        <Edit2 size={18} />
                      </button>
                      {deleteConfirm === event.id ? (
                        <div className="delete-confirm">
                          <span>削除しますか？</span>
                          <button 
                            className="btn-confirm-yes" 
                            onClick={() => handleDelete(event.id)}
                          >
                            はい
                          </button>
                          <button 
                            className="btn-confirm-no" 
                            onClick={() => setDeleteConfirm(null)}
                          >
                            いいえ
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="btn-delete" 
                          onClick={() => setDeleteConfirm(event.id)}
                          title="削除"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingEvent ? 'イベントを編集' : '新規イベント'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">イベント名 *</label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="例: FRIDAY NIGHT SESSION"
                    required
                  />
                </div>
              </div>

              <div className="form-row form-row-2">
                <div className="form-group">
                  <label htmlFor="date">日付 *</label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      const day = DAYS[date.getDay()];
                      setFormData({ ...formData, date: e.target.value, day });
                    }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="day">曜日</label>
                  <select
                    id="day"
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  >
                    {DAYS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row form-row-2">
                <div className="form-group">
                  <label htmlFor="time">時間 *</label>
                  <input
                    type="text"
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="例: 21:00〜midnight"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="entrance">入場料</label>
                  <input
                    type="text"
                    id="entrance"
                    value={formData.entrance}
                    onChange={(e) => setFormData({ ...formData, entrance: e.target.value })}
                    placeholder="例: FREE / ¥1,000"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="genre">ジャンル *</label>
                  <input
                    type="text"
                    id="genre"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="例: REGGAE / HIP HOP"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="djs">DJ（カンマ区切り）*</label>
                  <input
                    type="text"
                    id="djs"
                    value={formData.djs}
                    onChange={(e) => setFormData({ ...formData, djs: e.target.value })}
                    placeholder="例: DJ A, DJ B, DJ C"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="imageUrl">
                    <Image size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    イベント画像URL
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.imageUrl && (
                    <div className="image-preview">
                      <img src={formData.imageUrl} alt="プレビュー" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group form-group-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <span className="checkbox-label">
                      <Star size={16} />
                      注目イベントとして表示
                    </span>
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  キャンセル
                </button>
                <button type="submit" className="btn-save">
                  <Save size={18} />
                  {editingEvent ? '更新する' : '追加する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

