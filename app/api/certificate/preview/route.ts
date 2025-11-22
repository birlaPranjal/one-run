import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Helper function to generate PDF
async function generateCertificatePDF(name: string, distance: string) {
  // Generate PDF (same logic as main route but without saving to MongoDB)
  const certificatePath = path.join(process.cwd(), 'public', 'Certificate.jpg');
  const certificateImage = fs.readFileSync(certificatePath);

  // Get actual image dimensions using sharp
  const imageMetadata = await sharp(certificateImage).metadata();
  const originalWidth = imageMetadata.width || 5000;
  const originalHeight = imageMetadata.height || 3500;

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Embed the certificate image
  const certificateImageEmbed = await pdfDoc.embedJpg(certificateImage);
  
  // Use actual image dimensions for PDF page
  const pdfWidth = originalWidth * 0.75;
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
  const scaleX = pdfWidth / originalWidth;
  const scaleY = pdfHeight / originalHeight;
  
  // Use cursive/italic font for name (HelveticaOblique - italic style, lighter than bold)
  const nameFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  // Keep bold font for distance
  const distanceFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const nameFontSize = 200; // Increased font size for name
  const distanceFontSize = 90; // Increased font size for distance
  
  // Calculate scaled coordinates for name
  const nameX = 2528 * scaleX - (10 * scaleX);
  // Move down by subtracting 80 pixels (scaled) + 1px down + 2px more down
  const nameY = pdfHeight - (1891 * scaleY) - (80 * scaleY) - (1 * scaleY) - (2 * scaleY) - (5 * scaleY);
  
  // Draw name with cursive/italic font
  page.drawText(name, {
    x: nameX,
    y: nameY,
    size: nameFontSize,
    font: nameFont,
    color: rgb(0, 0, 0),
  });

  // Add distance text at coordinates: 3308, 2186
  // Move down by subtracting 80 pixels (scaled) - 2px up - 5px more up (add instead of subtract)
  // Move 15px left (subtract from X)
  const distanceText = distance.toUpperCase();
  const distanceX = (3308 * scaleX) - (70 * scaleX);
  const distanceY = pdfHeight - (2186 * scaleY) - (80 * scaleY) + (2 * scaleY) + (5 * scaleY);
  
  page.drawText(distanceText, {
    x: distanceX,
    y: distanceY,
    size: distanceFontSize,
    font: distanceFont,
    color: rgb(0, 0, 0),
  });

  // Serialize the PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

// GET handler - for direct PDF serving (production-friendly)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const distance = searchParams.get('distance');

    if (!name || !distance) {
      return NextResponse.json(
        { error: 'Name and distance are required' },
        { status: 400 }
      );
    }

    const pdfBytes = await generateCertificatePDF(name, distance);

    // Return PDF directly for iframe embedding
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="certificate-preview.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error generating preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}

// POST handler - kept for backward compatibility
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

    const pdfBytes = await generateCertificatePDF(name, distance);

    // Convert PDF to base64 for preview
    const base64 = Buffer.from(pdfBytes).toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64}`;

    // Return PDF as base64 for preview
    return NextResponse.json({ 
      previewUrl: dataUrl,
      pdfBase64: base64 
    });
  } catch (error) {
    console.error('Error generating preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}
