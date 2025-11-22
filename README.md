# Marathon Certificate Generator

A Next.js application for generating certificates for the One Indore Run marathon event. This tool allows you to create personalized PDF certificates with participant names and distances, and stores the data in MongoDB.

## Features

- 📝 Form-based certificate generation
- 🎨 Custom PDF generation with text overlay on certificate template
- 💾 MongoDB integration for storing certificate data
- 📥 Automatic PDF download

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string_here
```

For MongoDB Atlas, your connection string will look like:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

For local MongoDB:
```
mongodb://localhost:27017/marathon
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the certificate generator.

## Usage

1. Enter the participant's name in the "Participant Name" field
2. Enter the distance (e.g., "5K", "10K", "21K") in the "Distance" field
3. Click "Generate & Download Certificate"
4. The certificate will be saved to MongoDB and a PDF will be automatically downloaded

## Project Structure

- `app/page.tsx` - Main page with certificate generator form
- `app/components/CertificateGenerator.tsx` - Certificate generator form component
- `app/api/certificate/route.ts` - API route for certificate generation and MongoDB storage
- `lib/mongodb.ts` - MongoDB connection utility
- `public/Certificate.jpg` - Certificate template image

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
