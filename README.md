# BAR Habit ホームページ

大阪府高槻市のミュージックバー「BAR Habit」の公式ホームページです。

## 🎵 Features

- ヒーローセクション
- ABOUTセクション
- イベント情報（画像対応）
- アクセス・店舗情報（Google Maps）
- 管理者ページ（イベントCRUD）

## 🛠 Tech Stack

- React + TypeScript + Vite
- React Router
- Supabase（データベース）
- Lucide React Icons

---

## 📦 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseの設定

#### 2.1 Supabaseプロジェクト作成

1. [Supabase](https://supabase.com) にアクセスしてアカウント作成
2. 「New Project」でプロジェクト作成
3. Project Settings > API から以下を取得:
   - Project URL
   - anon public key

#### 2.2 データベーステーブル作成

Supabase SQLエディタで以下を実行:

```sql
-- eventsテーブル作成
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  genre TEXT NOT NULL,
  djs TEXT[] DEFAULT '{}',
  entrance TEXT DEFAULT 'FREE',
  featured BOOLEAN DEFAULT false,
  image_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS（Row Level Security）を有効化
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 誰でも読み取り可能
CREATE POLICY "Anyone can read events" ON events
  FOR SELECT USING (true);

-- 認証済みユーザーのみ書き込み可能（将来の拡張用）
-- 現在はanon keyで書き込み可能にしています
CREATE POLICY "Anyone can insert events" ON events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update events" ON events
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete events" ON events
  FOR DELETE USING (true);
```

#### 2.3 環境変数の設定

`.env` ファイルを作成:

```bash
cp .env.example .env
```

`.env` を編集:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_PASSWORD=your-secure-password
```

### 3. 開発サーバー起動

```bash
npm run dev
```

---

## 🚀 デプロイ（Render）

### 環境変数の設定

Renderのダッシュボードで以下の環境変数を設定:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
| `VITE_ADMIN_PASSWORD` | 管理者パスワード |

### ビルド設定

- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

---

## 👤 管理者ページ

- URL: `/admin`
- パスワード: 環境変数 `VITE_ADMIN_PASSWORD` で設定

### 機能

- イベントの追加・編集・削除
- イベント画像の設定（URL指定）
- 注目イベントの設定

---

## 📍 店舗情報

**BAR Habit**
- 住所: 大阪府高槻市高槻町4-3 サタリービル B1-A
- 最寄り: JR高槻駅 北口 徒歩5分 / 阪急高槻市駅 徒歩3〜5分
- Instagram: [@atsushiyoden](https://www.instagram.com/atsushiyoden/)

---

## 📄 License

MIT
