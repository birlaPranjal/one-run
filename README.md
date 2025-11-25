# Marathon Certificate Generator

A Next.js application for generating certificates for the One Indore Run marathon event. This tool allows you to create personalized PDF certificates with participant names and distances, and stores the data in MongoDB.

## Features

- 📝 Form-based certificate generation
- 🎨 Custom PDF generation with text overlay on certificate template
- 💾 MongoDB integration for storing certificate data
- 📥 Automatic PDF download
- 👁️ Certificate preview before download
- 🔍 Admin panel to view all unique entries
- 📊 CSV export functionality for data analysis
- 🔄 Duplicate detection and management

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

### Generating Certificates

1. Enter the participant's name in the "Participant Name" field
2. Select the distance from the dropdown (3 KM, 5 KM, or 7 KM)
3. Click "Preview Certificate" to see a preview before generating
4. Click "Download PDF" to generate and download the certificate
5. The certificate will be saved to MongoDB and a PDF will be automatically downloaded

### Admin Panel

Access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin) to:

- View all unique certificate entries (duplicates are automatically filtered)
- Search entries by name or distance
- See statistics: unique entries, total certificates, and duplicates removed
- Export data to CSV for analysis
- View duplicate counts for each entry

## Project Structure

- `app/page.tsx` - Main page with certificate generator form
- `app/components/CertificateGenerator.tsx` - Certificate generator form component
- `app/admin/page.tsx` - Admin panel for viewing and managing entries
- `app/preview/page.tsx` - Certificate preview page
- `app/api/certificate/route.ts` - API route for certificate generation and MongoDB storage
- `app/api/certificate/preview/route.ts` - API route for certificate preview
- `app/api/certificate/admin/route.ts` - API route for admin panel data
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
