# Jamaica Political Engagement Platform (JPEP)

JPEP is a digital platform designed to connect Jamaican citizens with their elected representatives and enhance democratic accountability through transparency, communication, and engagement.

# Jamaica Political Engagement Platform (JPEP) - Project Structure

```
jpep/
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── representatives/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── constituencies/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── messages/
│   │   │       └── route.ts
│   │   ├── representatives/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── constituencies/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── navigation.tsx
│   │   ├── representatives/
│   │   │   ├── profile-card.tsx
│   │   │   ├── voting-record.tsx
│   │   │   ├── performance-metrics.tsx
│   │   │   └── message-form.tsx
│   │   ├── constituencies/
│   │   │   ├── map.tsx
│   │   │   ├── info-card.tsx
│   │   │   └── projects-list.tsx
│   │   ├── dashboard/
│   │   │   ├── stats-card.tsx
│   │   │   ├── activity-feed.tsx
│   │   │   └── recent-bills.tsx
│   │   └── forms/
│   │       ├── contact-form.tsx
│   │       ├── search-form.tsx
│   │       └── feedback-form.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── types/
│   │   ├── representative.ts
│   │   ├── constituency.ts
│   │   ├── user.ts
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-representatives.ts
│   │   ├── use-constituencies.ts
│   │   └── use-auth.ts
│   └── services/
│       ├── representative-service.ts
│       ├── constituency-service.ts
│       ├── message-service.ts
│       └── data-fetcher.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── scripts/
│   ├── seed-data.ts
│   └── import-constituencies.ts
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Features

- **Representative Profiles**: Comprehensive profiles of elected officials with biographical information, voting records, committee assignments, and performance metrics.
- **Constituency Information**: Detailed information about constituencies including demographics, projects, and boundaries.
- **Performance Tracking**: Metrics to track and evaluate representative performance including attendance, bill sponsorship, and constituent responsiveness.
- **Direct Communication**: Secure messaging between citizens and their representatives.
- **Constituency Projects**: Information on development projects within constituencies.
- **Interactive Map**: Visual representation of constituencies with the ability to find representatives by location.
- **Parliamentary Activity**: Tracking of bills, votes, speeches, and other parliamentary activities.

## Tech Stack

- **Frontend**: React.js, Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js with Next.js API routes
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel/Netlify

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/jpep.git
   cd jpep
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Update the `.env` file with your specific configurations.

4. Set up the database:
   ```
   npx prisma migrate dev
   ```

5. Seed the database with initial data:
   ```
   npm run seed
   # or
   yarn seed
   ```

6. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development Workflow

1. Create a new branch for your feature/fix:
   ```
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```
   git add .
   git commit -m "Your descriptive commit message"
   ```

3. Push your branch and create a pull request:
   ```
   git push origin feature/your-feature-name
   ```

## Deployment

The application can be easily deployed to Vercel or Netlify:

### Vercel

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Deploy:
   ```
   vercel
   ```

### Netlify

1. Install the Netlify CLI:
   ```
   npm install -g netlify-cli
   ```

2. Deploy:
   ```
   netlify deploy
   ```

## Contributing

We welcome contributions to improve the platform. Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Parliament of Jamaica
- Electoral Commission of Jamaica
- Open Government Partnership