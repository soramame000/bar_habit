import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MapPin, Clock, Music, ChevronDown, Menu, X, Settings } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import './Home.css';

export default function Home() {
  const { events } = useEvents();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  // 日付でソートして表示
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date.replace(/\./g, '-'));
    const dateB = new Date(b.date.replace(/\./g, '-'));
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="app">
      {/* Header */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <a href="#" className="logo" onClick={() => scrollToSection('hero')}>
            <div className="logo-icon">
              <svg viewBox="0 0 60 60" className="logo-svg">
                <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 22 C25 18, 35 18, 40 22 L40 30 C35 34, 25 34, 20 30 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M25 30 L25 42 M35 30 L35 42" stroke="currentColor" strokeWidth="2"/>
                <path d="M22 38 L30 44 L38 38" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <span className="logo-text">BAR Habit</span>
          </a>
          
          <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
            <button className="nav-link" onClick={() => scrollToSection('about')}>ABOUT</button>
            <button className="nav-link" onClick={() => scrollToSection('events')}>EVENTS</button>
            <button className="nav-link" onClick={() => scrollToSection('access')}>ACCESS</button>
            <a 
              href="https://www.instagram.com/atsushiyoden/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link nav-link-instagram"
            >
              <Instagram size={18} />
              Instagram
            </a>
            <Link to="/admin" className="nav-link nav-link-admin">
              <Settings size={18} />
            </Link>
          </nav>
          
          <button 
            className="menu-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="メニュー切り替え"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="hero-bg">
          <div className="hero-pattern"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-badge">
            <Music size={16} />
            <span>MUSIC BAR IN TAKATSUKI</span>
          </div>
          <h1 className="hero-title">
            <span className="hero-title-bar">BAR</span>
            <span className="hero-title-habit">Habit</span>
          </h1>
          <p className="hero-tagline">
            平日はしっぽり、週末は音楽を<br />
            <span className="hero-tagline-accent">REGGAE • HIP HOP • J-POP</span>
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => scrollToSection('events')}>
              EVENT INFO
              <ChevronDown size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => scrollToSection('access')}>
              ACCESS
            </button>
          </div>
        </div>
        <div className="hero-scroll">
          <span>SCROLL</span>
          <div className="hero-scroll-line"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <span className="section-label">ABOUT US</span>
            <h2 className="section-title">BAR Habitとは</h2>
          </div>
          <div className="about-grid">
            <div className="about-card">
              <div className="about-card-icon">
                <Music size={32} />
              </div>
              <h3>週末は音楽イベント</h3>
              <p>
                レゲエ、ヒップホップ、J-POPなど様々なジャンルの音楽イベントを開催。
                地元のDJやアーティストが集まり、最高の夜を演出します。
              </p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">
                <Clock size={32} />
              </div>
              <h3>平日はしっぽり</h3>
              <p>
                平日は落ち着いた雰囲気でお酒を楽しめます。
                仕事帰りの一杯や、友人との語らいの場所として最適です。
              </p>
            </div>
            <div className="about-card about-card-accent">
              <div className="about-card-content">
                <p className="about-quote">
                  "音楽と酒が交わる<br />
                  特別な空間へようこそ"
                </p>
                <span className="about-quote-author">— BAR Habit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="events">
        <div className="container">
          <div className="section-header">
            <span className="section-label">UPCOMING EVENTS</span>
            <h2 className="section-title">イベント情報</h2>
          </div>
          <div className="events-grid">
            {sortedEvents.map((event) => (
              <article key={event.id} className={`event-card ${event.featured ? 'featured' : ''} ${event.imageUrl ? 'has-image' : ''}`}>
                {event.featured && <div className="event-badge">FEATURED</div>}
                {event.imageUrl && (
                  <div className="event-image">
                    <img src={event.imageUrl} alt={event.title} />
                  </div>
                )}
                <div className="event-content">
                  <div className="event-date">
                    <span className="event-date-num">{event.date.split('.')[2]}</span>
                    <span className="event-date-month">{event.date.split('.')[1]}月</span>
                    <span className="event-date-day">{event.day}</span>
                  </div>
                  <div className="event-info">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-meta">
                      <span className="event-time">{event.time}</span>
                      <span className="event-genre">{event.genre}</span>
                    </div>
                    <div className="event-djs">
                      <span className="event-djs-label">DJ:</span>
                      <span className="event-djs-names">{event.djs.join(' / ')}</span>
                    </div>
                    <div className="event-entrance">
                      <span>ENTRANCE:</span>
                      <strong>{event.entrance}</strong>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="events-cta">
            <p>最新のイベント情報はInstagramをチェック！</p>
            <a 
              href="https://www.instagram.com/atsushiyoden/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-instagram"
            >
              <Instagram size={20} />
              @atsushiyoden
            </a>
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section id="access" className="access">
        <div className="container">
          <div className="section-header">
            <span className="section-label">ACCESS</span>
            <h2 className="section-title">アクセス・店舗情報</h2>
          </div>
          <div className="access-grid">
            <div className="access-info">
              <div className="access-item">
                <h3>
                  <MapPin size={20} />
                  住所
                </h3>
                <p>
                  〒569-0803<br />
                  大阪府高槻市高槻町4-3<br />
                  サタリービル B1-A
                </p>
              </div>
              <div className="access-item">
                <h3>
                  <Clock size={20} />
                  営業時間
                </h3>
                <p>
                  イベントにより異なります<br />
                  詳細はInstagramをご確認ください
                </p>
              </div>
              <div className="access-item">
                <h3>
                  🚃 最寄り駅
                </h3>
                <p>
                  JR高槻駅 北口より徒歩約5分<br />
                  阪急高槻市駅より徒歩3〜5分
                </p>
              </div>
              <a 
                href="https://www.google.com/maps/place/%E5%A4%A7%E9%98%AA%E5%BA%9C%E9%AB%98%E6%A7%BB%E5%B8%82%E9%AB%98%E6%A7%BB%E7%94%BA4-3" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-map"
              >
                <MapPin size={18} />
                Google Mapで見る
              </a>
            </div>
            <div className="access-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.9!2d135.6175!3d34.8485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6001079c5f8f9a1d%3A0x0!2z5aSn6Ziq5bqc6auY5qe75biC6auY5qe755S6NC0z!5e0!3m2!1sja!2sjp!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="BAR Habit 地図"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <svg viewBox="0 0 60 60" className="footer-logo-svg">
                  <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 22 C25 18, 35 18, 40 22 L40 30 C35 34, 25 34, 20 30 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M25 30 L25 42 M35 30 L35 42" stroke="currentColor" strokeWidth="2"/>
                  <path d="M22 38 L30 44 L38 38" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>BAR Habit</span>
              </div>
              <p className="footer-address">
                大阪府高槻市高槻町4-3 サタリービル B1-A
              </p>
            </div>
            <div className="footer-social">
              <a 
                href="https://www.instagram.com/atsushiyoden/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} BAR Habit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

