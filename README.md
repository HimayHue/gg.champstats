# ChampStats

**ChampStats** is a high-performance **League of Legends analytics dashboard** built with **Next.js 16**.  
It tracks **player statistics, champion masteries, and live match data** using the **Riot Games API**, and features a modern **dark-themed UI**.

---

# 🚀 Getting Started

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Set Up Environment Variables

Create a `.env` file in the project root and add the following:

```env
# MongoDB & Prisma
DATABASE_URL="mongodb+srv://USER:PASSWORD@cluster.mongodb.net/champstats?retryWrites=true&w=majority"

# Riot Games API
# Get a key at https://developer.riotgames.com/
RIOT_API_KEY="RGAPI-your-api-key-here"

# Auth.js
AUTH_SECRET="your-random-secret"
AUTH_GOOGLE_ID="your-id"
AUTH_GOOGLE_SECRET="your-secret"
```

---

## 3. Initialize the Database

```bash
npx prisma generate
npx prisma db push
```

---

# 📂 Project Structure & Naming Conventions

To keep the codebase clean and maintainable, the project follows strict naming rules.

### Files & Folders

Use **kebab-case**

```
app/lol/[region]/[summoner]/page.tsx
```

### React Components

Use **PascalCase**

```
ChampionCard.tsx
SummonerStats.tsx
```

### Utilities & Variables

Use **camelCase**

```
toTitleCase.ts
calculateWinRate.ts
```

---

# 📝 Commit Convention

This project follows **Conventional Commits**:

```
type(scope?): message
```

### Types

- **feat** – New feature
- **fix** – Bug fix
- **chore** – Maintenance or dependency updates
- **style** – UI or CSS changes

### Examples

```
feat(profile): add win rate calculator to summoner page
fix(api): resolve 403 error on Riot ID lookups
chore(deps): update prisma dependencies
style(ui): adjust champion card spacing
```

---

## 🌿 Branch Naming

Use the format:

type/short-description

Examples:

feature/profile-search  
feature/live-match  
fix/api-timeout  
refactor/api-client  
chore/update-dependencies  

Guidelines:

- Use **lowercase**
- Use **kebab-case** (hyphens)
- Keep names **short and descriptive**

Do not commit directly to `Production`.  
Create a branch → open a pull request → merge into `main`.

# 📙 Useful Commands

### Run the Development Server

```bash
npm run dev
```

### Update Prisma Schema

```bash
npx prisma db push
```

### Open Prisma Studio

```bash
npx prisma studio
```

---

# ⚡ Tech Stack

- **Next.js 16**
- **MongoDB**
- **Prisma**
- **Auth.js**
- **Riot Games API**
- **Tailwind CSS**

---

# 📊 Features

- Player statistics tracking
- Champion mastery analytics
- Live match information
- Riot API integration
- Secure authentication
- Dark themed UI dashboard