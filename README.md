# Kids Reading Word Helper

A comprehensive English vocabulary learning website designed for children reading English books. Built with Next.js, TailwindCSS, and Prisma.

## 🎯 Features

- **Word Search**: Search English words with meanings, phonetics (UK/US), and pronunciation
- **Dictionary Integration**: Uses Dictionary API for comprehensive word data
- **Group Management**: Create and manage word groups (e.g., "Peppa Pig Book 1")
- **Flashcard Study Mode**: Interactive flashcards with flip animations and spaced repetition
- **Audio Pronunciation**: UK and US pronunciation support
- **Child-Friendly UI**: Clean, colorful interface optimized for kids
- **Mobile Responsive**: Works seamlessly on phones and tablets

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+, React 18, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components
- **Database**: Prisma ORM with SQLite
- **API**: Dictionary API (https://api.dictionaryapi.dev)
- **Audio**: HTML5 Audio API for pronunciation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone and setup the project:**
   ```bash
   cd Kids-Reading-Word-Helper
   npm install
   ```

2. **Set up the database:**
   ```bash
   # Initialize Prisma and create the database
   npm run db:push

   # Generate Prisma client
   npm run db:generate
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 How to Use

### 1. Word Search (Homepage)
- Enter any English word in the search bar
- View meanings, phonetics, pronunciation buttons, and example sentences
- Add the word to a group for later study

### 2. Group Management
- Create new groups (e.g., by book name or topic)
- Add words to groups from the search results
- Edit group names or delete empty groups

### 3. Study with Flashcards
- Click "Start Flashcards" on any group page
- Use keyboard shortcuts:
  - **Space/Enter**: Flip the card
  - **Arrow Keys**: Navigate between cards
  - **K**: Mark as "Known"
  - **U**: Mark as "Need Practice"
- View your progress and study statistics

### 4. Spaced Repetition
- Words marked as "Need Practice" go to the back of the queue
- Complete session shows statistics and allows reviewing unknown words

## 🎨 UI Components

### Key Pages
- **Homepage (`/`)**: Word search and results
- **Groups (`/groups`)**: Group management and creation
- **Group Detail (`/groups/[id]`)**: Word list and flashcard access

### Components
- `WordSearch`: Search input and results display
- `WordResult`: Word information card with group selection
- `FlashcardViewer`: Interactive flashcard study mode
- `PronunciationButton`: Audio playback for UK/US pronunciation
- `Navigation`: Site navigation with responsive design

## 📊 Database Schema

### Models

**Word**
```typescript
{
  id: string
  word: string
  meaningCn: string
  phoneticUk?: string
  phoneticUs?: string
  audioUk?: string
  audioUs?: string
  exampleSentence?: string
  exampleTranslation?: string
  partOfSpeech?: string
  createdAt: Date
  updatedAt: Date
}
```

**Group**
```typescript
{
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}
```

**WordGroup** (Join Table)
```typescript
{
  id: string
  wordId: string
  groupId: string
  createdAt: Date
}
```

**FlashcardSession**
```typescript
{
  id: string
  groupId: string
  totalWords: number
  knownWords: number
  unknownWords: number
  createdAt: Date
}
```

## 🔄 API Endpoints

### Word Search
- `GET /api/words/search?q=<word>` - Search for a word

### Groups
- `GET /api/groups` - List all groups
- `POST /api/groups` - Create a new group
- `PUT /api/groups/[id]` - Update a group
- `DELETE /api/groups/[id]` - Delete a group

### Group Words
- `GET /api/groups/[id]/words` - Get words in a group
- `DELETE /api/groups/[id]/words` - Remove word from group

### Word Management
- `POST /api/words/add-to-group` - Add word to group

### Flashcard Sessions
- `POST /api/flashcards/sessions` - Save study session
- `GET /api/flashcards/sessions` - Get session history

## 🎯 Learning Features

### Dictionary Integration
- Comprehensive word definitions
- UK and US phonetics
- Audio pronunciation
- Example sentences with translations

### Study Modes
- **Word List**: View all words with details
- **Flashcards**: Interactive study with spaced repetition
- **Audio Learning**: Pronunciation practice

### Progress Tracking
- Study session statistics
- Known vs. unknown words tracking
- Session history

## 🛠️ Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio

# Linting
npm run lint         # Run ESLint
```

## 📱 Mobile Support

The application is fully responsive and works great on:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized touch interactions
- **Phone**: Mobile-first design with swipe gestures

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database (SQLite by default)
DATABASE_URL="file:./dev.db"

# Optional: For production databases
# DATABASE_URL="postgresql://user:password@localhost:5432/vocabulary_db"
```

### Database Options
- **Development**: SQLite (default, file-based)
- **Production**: PostgreSQL, MySQL, or other supported databases

## 🎨 Customization

### Colors and Theme
The app uses TailwindCSS with a child-friendly color scheme. Modify `tailwind.config.ts` to customize colors and themes.

### Adding New Features
- Follow the existing component structure
- Use TypeScript for type safety
- Implement responsive design principles
- Add appropriate error handling

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues, questions, or feature requests:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include screenshots for UI issues

---

Happy learning! 📚✨