import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection('certificates');
    
    // Use aggregation to get unique entries based on name and distance
    // Group by name and distance, and get the first (or latest) entry for each combination
    const uniqueEntries = await collection
      .aggregate([
        {
          $sort: { createdAt: -1 } // Sort by creation date descending (newest first)
        },
        {
          $group: {
            _id: {
              name: { $toLower: { $trim: { input: '$name' } } }, // Case-insensitive, trimmed
              distance: { $toUpper: { $trim: { input: '$distance' } } } // Uppercase, trimmed
            },
            name: { $first: '$name' }, // Keep original name casing
            distance: { $first: '$distance' }, // Keep original distance casing
            createdAt: { $first: '$createdAt' }, // Get the first (newest) creation date
            count: { $sum: 1 } // Count how many duplicates exist
          }
        },
        {
          $project: {
            _id: 0,
            name: 1,
            distance: 1,
            createdAt: 1,
            count: 1
          }
        },
        {
          $sort: { createdAt: -1 } // Sort results by creation date
        }
      ])
      .toArray();

    return NextResponse.json(
      { entries: uniqueEntries, total: uniqueEntries.length },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching admin entries:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to fetch entries',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}


