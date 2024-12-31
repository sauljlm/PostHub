import React, { useState } from "react";

const UploadImage = ({ setFile, labelText }) => {
  const handleFileInputChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="">
      {labelText ? <label className="block mb-2 text-gray-500">{labelText}</label> : null}
      <input
        type="file"
        accept="image/*"
        className="px-3 py-2 leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline"
        onChange={handleFileInputChange}
      />
    </div>
  );
};

export default UploadImage;
