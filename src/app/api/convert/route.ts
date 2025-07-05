import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (image.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 50MB.' },
        { status: 400 }
      );
    }

    // Check if file is an image
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Convert image to buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to WebP using Sharp
    const webpBuffer = await sharp(buffer)
      .webp({
        quality: 80, // Good balance between quality and file size
        effort: 6,   // Higher effort for better compression
      })
      .toBuffer();

    // Return the WebP image
    return new NextResponse(webpBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'image/webp',
        'Content-Disposition': `attachment; filename="${image.name.replace(/\.[^/.]+$/, '.webp')}"`,
      },
    });

  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert image' },
      { status: 500 }
    );
  }
} 