import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import './Login.css';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useEvents();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 少し遅延を入れてUX向上
    await new Promise(resolve => setTimeout(resolve, 500));

    if (login(password)) {
      navigate('/admin');
    } else {
      setError('パスワードが正しくありません');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-pattern"></div>
      </div>
      
      <div className="login-container">
        <Link to="/" className="login-back">
          <ArrowLeft size={20} />
          トップページへ戻る
        </Link>

        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <Lock size={32} />
            </div>
            <h1>管理者ログイン</h1>
            <p>BAR Habit 管理システム</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">パスワード</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="管理者パスワードを入力"
                required
                autoFocus
              />
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="login-loading">
                  <span className="spinner"></span>
                  ログイン中...
                </span>
              ) : (
                'ログイン'
              )}
            </button>
          </form>
        </div>

        <p className="login-hint">
          ※ 管理者のみアクセス可能です
        </p>
      </div>
    </div>
  );
}

