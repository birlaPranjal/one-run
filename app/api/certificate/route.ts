import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { getDatabase } from '@/lib/mongodb';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, distance } = body;

    if (!name || !distance) {
      return NextResponse.json(
        { error: 'Name and distance are required' },
        { status: 400 }
      );
    }

    // Save to MongoDB
    const db = await getDatabase();
    const collection = db.collection('certificates');
    
    const certificateData = {
      name,
      distance,
      createdAt: new Date(),
    };

    await collection.insertOne(certificateData);

    // Generate PDF
    const certificatePath = path.join(process.cwd(), 'public', 'Certificate.jpg');
    const certificateImage = fs.readFileSync(certificatePath);

    // Get actual image dimensions using sharp
    const imageMetadata = await sharp(certificateImage).metadata();
    const originalWidth = imageMetadata.width || 5000; // Fallback if metadata unavailable
    const originalHeight = imageMetadata.height || 3500;

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Embed the certificate image
    const certificateImageEmbed = await pdfDoc.embedJpg(certificateImage);
    
    // Use actual image dimensions for PDF page (scale to fit standard page if needed)
    // A4 size: 595 x 842 points (or use image dimensions directly)
    const pdfWidth = originalWidth * 0.75; // Scale down to fit PDF nicely
    const pdfHeight = originalHeight * 0.75;
    
    const page = pdfDoc.addPage([pdfWidth, pdfHeight]);
    
    // Draw the certificate image
    page.drawImage(certificateImageEmbed, {
      x: 0,
      y: 0,
      width: pdfWidth,
      height: pdfHeight,
    });

    // Add text overlay for name
    // Original coordinates: 2528, 1891 (from image description)
    // Calculate scale factor
    const scaleX = pdfWidth / originalWidth;
    const scaleY = pdfHeight / originalHeight;
    
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const nameFontSize = 120; // Increased font size for name
    const distanceFontSize = 120; // Increased font size for distance
    
    // Calculate scaled coordinates
    // X coordinate scales horizontally
    const nameX = 2528 * scaleX;
    // Y coordinate: in PDF, Y is from bottom, so we need to invert
    const nameY = pdfHeight - (1891 * scaleY);
    
    // Draw name
    page.drawText(name, {
      x: nameX,
      y: nameY,
      size: nameFontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Add distance text at coordinates: 3308, 2186
    const distanceText = distance.toUpperCase();
    const distanceX = 3308 * scaleX;
    const distanceY = pdfHeight - (2186 * scaleY);
    
    page.drawText(distanceText, {
      x: distanceX,
      y: distanceY,
      size: distanceFontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Serialize the PDF
    const pdfBytes = await pdfDoc.save();

    // Return PDF as response
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${name.replace(/\s+/g, '-')}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}

