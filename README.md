# 🔥 Calorie Consumption Contest

A fun, competitive calorie tracking app built with Astro for friendly contests where participants compete to consume the most calories.

## Features

- **User Registration**: Simple username-based registration system
- **Calorie Logging**: Easy calorie entry with validation
- **Real-time Leaderboard**: Live rankings showing who's in the lead
- **Responsive Design**: Works great on desktop and mobile
- **Data Persistence**: All data stored in JSON format

## How It Works

1. **Join the Contest**: Enter your username to register
2. **Log Your Calories**: Add calories consumed throughout the day
3. **Check the Leaderboard**: See how you rank against other participants
4. **Win the Contest**: Be the person with the most calories consumed!

## Tech Stack

- **Framework**: Astro 5.x
- **Styling**: Vanilla CSS with gradient backgrounds
- **Data Storage**: JSON file-based storage
- **Deployment**: Vercel-ready
- **API**: Custom Astro API routes

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/patrickrbecker/calorie-tracker.git
cd calorie-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:4321`

## API Endpoints

### POST /api/register
Register a new user for the contest.

**Body:**
```json
{
  "username": "your-username"
}
```

### POST /api/calories
Add calories for a registered user.

**Body:**
```json
{
  "username": "your-username",
  "calories": 500
}
```

## Data Structure

User data is stored in `/data/users.json`:

```json
[
  {
    "username": "participant1",
    "totalCalories": 2500,
    "entries": [
      {
        "calories": 500,
        "date": "2025-01-15T10:30:00.000Z",
        "dateString": "Mon Jan 15 2025"
      }
    ],
    "joinedDate": "2025-01-15T09:00:00.000Z"
  }
]
```

## Deployment

This app is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your Vercel account to the repository
3. Deploy with default settings

The app will automatically build and deploy your Astro application.

## Contest Rules

- Participants compete to consume the most total calories
- All calorie entries are cumulative
- Leaderboard updates in real-time
- Winners are determined by highest total calorie consumption

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this for your own contests!

---

**Have fun with your calorie consumption contest! 🍕🍔🍰**
