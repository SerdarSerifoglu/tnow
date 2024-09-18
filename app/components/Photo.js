"use client"
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const Photo = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
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
          <h2>Çekilen Fotoğraf:</h2>
          <img src={capturedImage} alt="Captured" width={320} />
        </div>
      )}

      <hr />

      {/* Resim Yükle */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      
      {/* Yüklenen Resmi Göster */}
      {uploadedImage && (
        <div>
          <h2>Yüklenen Resim:</h2>
          <img src={uploadedImage} alt="Uploaded" width={320} />
        </div>
      )}
    </div>
  );
};

export default Photo;
