# 🔥 October 2025 Burning Contest

A competitive calorie burning tracking app built with Astro for the October 2025 contest where participants compete to burn the most calories.

## Features

- **Participant Registration**: Add contestants to the October 2025 burning contest
- **Daily Calorie Tracking**: Log calories burned by date with Excel-style table layout
- **Weekly Organization**: Contest organized into 5 weeks of October 2025
- **Weekly Totals**: Automatic calculation of weekly calorie burn totals
- **Week Navigation**: Navigate between different weeks of the contest
- **Excel-style Interface**: Clean spreadsheet-like appearance matching provided template
- **October 2025 Focus**: Specifically tailored for October 1-31, 2025 contest

## How It Works

1. **Add Participants**: Register contestants for the October 2025 burning contest
2. **Daily Tracking**: Log calories burned each day during October 2025
3. **Weekly Progress**: View organized weekly data with automatic totals
4. **Navigate Weeks**: Move between the 5 weeks of October using week navigation
5. **Win the Contest**: Be the participant who burns the most calories!

## Tech Stack

- **Framework**: Astro 5.x with serverless adapter
- **Styling**: Excel-style table layout with professional appearance
- **Data Storage**: In-memory JSON storage optimized for contest duration
- **Deployment**: Vercel serverless deployment
- **API**: Custom API routes for participant and calorie management
- **Contest Period**: October 1-31, 2025 (5 weeks)

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

### POST /api/add-participant
Add a new participant to the October 2025 contest.

**Body:**
```json
{
  "name": "participant-name"
}
```

### POST /api/add-calories
Log calories burned for a specific date and participant.

**Body:**
```json
{
  "date": "2025-10-15",
  "participant": "participant-name", 
  "calories": 500,
  "week": 3
}
```

### POST /api/change-week
Navigate to a different week of the contest.

**Body:**
```json
{
  "week": 2
}
```

## Data Structure

Contest data is organized by weeks and dates:

```json
{
  "currentWeek": 2,
  "contestName": "October 2025 Burning Contest",
  "contestStart": "2025-10-01",
  "contestEnd": "2025-10-31",
  "participants": ["Alice", "Bob", "Charlie"],
  "weeks": {
    "1": {
      "2025-10-01": { "Alice": 450, "Bob": 520 },
      "2025-10-02": { "Alice": 380, "Bob": 600, "Charlie": 490 }
    },
    "2": {
      "2025-10-08": { "Alice": 420, "Bob": 510, "Charlie": 380 }
    }
  }
}
```

## Deployment

This app is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your Vercel account to the repository
3. Deploy with default settings

The app will automatically build and deploy your Astro application.

## Contest Rules

- **Duration**: October 1-31, 2025 (exactly 31 days)
- **Goal**: Participants compete to burn the most calories each day
- **Tracking**: Daily calorie burn entries organized by week
- **Weeks**: Contest spans 5 weeks of October 2025
- **Totals**: Weekly totals automatically calculated and displayed
- **Winner**: Participant with highest total calories burned wins

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this for your own contests!

---

**Have fun with your calorie consumption contest! 🍕🍔🍰**
