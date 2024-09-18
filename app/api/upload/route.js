import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { imageData, fileName } = await req.json();

    const formData = new FormData();
    formData.append('file', imageData);
    formData.append('upload_preset', 'srdr0000'); // Cloudinary'deki upload preset
    formData.append('public_id', fileName);

    const response = await fetch('https://api.cloudinary.com/v1_1/serdarcloud/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json({ url: data.secure_url });
  } catch (error) {
    return NextResponse.json({ message: 'Error uploading the file' }, { status: 500 });
  }
}
