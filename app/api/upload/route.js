import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// POST metodunu export et
export async function POST(req) {
  try {
    const { imageData, fileName } = await req.json();

    // Resmin kaydedileceği yol
    const filePath = path.join(process.cwd(), 'public/images', fileName);

    // Base64 formatındaki resmi decode et ve kaydet
    const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, '');

    fs.writeFileSync(filePath, base64Data, 'base64');

    // Kaydedilen dosyanın URL'ini döndür
    return NextResponse.json({ url: `/images/${fileName}` });
  } catch (error) {
    return NextResponse.json({ message: 'Error saving the file' }, { status: 500 });
  }
}
