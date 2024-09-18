"use client"
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const Photo = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [savedImageUrl, setSavedImageUrl] = useState(null);

  // Fotoğrafı çek ve canvas'a çiz
  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      // Canvas boyutunu ayarla
      canvas.width = img.width;
      canvas.height = img.height;

      // Çekilen fotoğrafı çiz
      ctx.drawImage(img, 0, 0);

      // Çerçeve ekle (örneğin basit bir kırmızı kenarlık)
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 10;
      ctx.strokeRect(0, 0, img.width, img.height);

      // Çerçeveli fotoğrafı base64 formatında al
      const framedImage = canvas.toDataURL('image/jpeg');
      setCapturedImage(framedImage);
    };
  };

  // Fotoğrafı sunucuya gönder ve kaydet
  const savePhoto = async () => {
    const fileName = `photo_${Date.now()}.jpeg`;

    try {
      const response = await axios.post('/api/upload', {
        imageData: capturedImage,
        fileName: fileName,
      });

      setSavedImageUrl(response.data.url);
    } catch (error) {
      console.error('Error uploading the image', error);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Fotoğraf Çek ve Yükle</h1>

      {/* Kamera ile Fotoğraf Çek */}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
      />
      <br />
      <button onClick={capturePhoto}>Fotoğraf Çek</button>

      {/* Çekilen Fotoğrafı Göster */}
      {capturedImage && (
        <div>
          <h2>Çerçeveli Fotoğraf:</h2>
          <img src={capturedImage} alt="Framed Captured" width={320} />
          <br />
          <button onClick={savePhoto}>Fotoğrafı Kaydet</button>
        </div>
      )}

      {/* Kaydedilen Fotoğrafın URL'sini Göster */}
      {savedImageUrl && (
        <div>
          <h2>Kaydedilen Fotoğraf:</h2>
          <a href={savedImageUrl} target="_blank" rel="noopener noreferrer">
            Fotoğrafa Git
          </a>
        </div>
      )}
    </div>
  );
};

export default Photo;
