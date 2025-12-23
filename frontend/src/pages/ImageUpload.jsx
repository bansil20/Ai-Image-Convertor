import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const ImageUpload = () => {
  const webcamRef = useRef(null);

  const [useWebcam, setUseWebcam] = useState(false);
  const [image, setImage] = useState(null);

  // Capture image from webcam
  const captureImage = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
    setUseWebcam(false);
  };

  // Upload from folder
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">

      <h2 className="text-xl text-black font-bold text-center mb-4">
        Upload the Photo
      </h2>

      {/* Webcam Section */}
      {useWebcam && (
        <div className="mb-4">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-lg"
          />
          <button
            onClick={captureImage}
            className="mt-3 w-full text-white py-2 rounded-lg"
          >
            Capture Photo
          </button>
        </div>
      )}

      {/* Preview Section */}
      {image && !useWebcam && (
        <div className="mb-4">
          <img
            src={image}
            alt="Preview"
            className="w-full rounded-lg border"
          />
        </div>
      )}

      {/* Buttons */}
      {!useWebcam && (
        <div className="flex flex-col gap-3">

          {/* Open Webcam */}
          <button
            onClick={() => setUseWebcam(true)}
            className="text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Open Camera
          </button>

          {/* Upload from Folder */}
          <label className="bg-gray-400 text-center py-2 rounded-lg cursor-pointer hover:bg-gray-300">
            Upload from Device
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

        </div>
      )}

        {/*Generate button*/}
        <button className="mt-4 w-full text-white py-2 rounded-lg">
            Generate Image
        </button>
    </div>
  );
};

export default ImageUpload;
