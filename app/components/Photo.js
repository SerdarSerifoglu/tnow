"use client";
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const Photo = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [savedImageUrl, setSavedImageUrl] = useState(null);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');

  // Fotoğrafı çek ve canvas'a çiz
  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      // Canvas boyutunu ayarla (yüksek çözünürlük)
      const scaleFactor = 2; // Çözünürlüğü 2x artır
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor + 100; // Metin için yer açıyoruz

      // Çekilen fotoğrafı ölçekleyerek çiz
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height - 100);

      // Bulut temalı çerçeve ekle
      ctx.strokeStyle = 'lightblue';
      ctx.lineWidth = 15;
      ctx.strokeRect(0, 0, canvas.width, canvas.height - 100);

      // Köşeleri yuvarlatılmış bar çiz
      const barHeight = 60;
      const barWidth = canvas.width - 40;
      const barX = 20;
      const barY = canvas.height - 80;

      ctx.fillStyle = 'rgba(0, 0, 255, 0.7)'; // Mavi transparan bar
      ctx.lineJoin = 'round';
      ctx.lineWidth = 20;
      ctx.strokeStyle = 'transparent'; // Kenarlık olmayacak

      ctx.beginPath();
      ctx.moveTo(barX + 10, barY);
      ctx.lineTo(barX + barWidth - 10, barY);
      ctx.quadraticCurveTo(barX + barWidth, barY, barX + barWidth, barY + 10);
      ctx.lineTo(barX + barWidth, barY + barHeight - 10);
      ctx.quadraticCurveTo(barX + barWidth, barY + barHeight, barX + barWidth - 10, barY + barHeight);
      ctx.lineTo(barX + 10, barY + barHeight);
      ctx.quadraticCurveTo(barX, barY + barHeight, barX, barY + barHeight - 10);
      ctx.lineTo(barX, barY + 10);
      ctx.quadraticCurveTo(barX, barY, barX + 10, barY);
      ctx.closePath();
      ctx.fill();

      // İsim ve şirket bilgilerini barın içine ekle
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(name, canvas.width / 2, barY + 25); // İsim ekleme
      ctx.fillText(company, canvas.width / 2, barY + 50); // Şirket ekleme

      // Çerçeveli ve metin eklenmiş fotoğrafı daha yüksek kalitede al
      const framedImage = canvas.toDataURL('image/jpeg', 1); // Kaliteyi %100'e ayarla
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

      {/* İsim ve Şirket Bilgisi Inputları */}
      <div>
        <input
          type="text"
          placeholder="İsminizi girin"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ margin: '10px', padding: '10px', fontSize: '16px' }}
        />
        <input
          type="text"
          placeholder="Şirket Bilgilerinizi girin"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{ margin: '10px', padding: '10px', fontSize: '16px' }}
        />
      </div>

      {/* Kamera ile Fotoğraf Çek */}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 1920, // Daha yüksek çözünürlük
          height: 1080,
          facingMode: "user"
        }}
        width={640}
        height={480}
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
