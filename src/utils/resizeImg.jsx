const resizeImage = (file, maxWidth, maxHeight, size, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Mantener la relación de aspecto
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height *= maxWidth / width));
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width *= maxHeight / height));
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // 👉 Comprimir iterativamente hasta que pese <= 1 MB
            const compress = (quality) => {
                canvas.toBlob(
                  (blob) => {
                    if (blob.size <= 1024 * 1024 || quality <= 0.1) {
                      // ✅ si ya pesa <= 1MB o la calidad bajó demasiado, devolvemos el archivo
                      const resizedFile = new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
                        type: "image/jpeg",
                      });
                      callback(resizedFile);
                    } else {
                      // 🔁 si pesa más de 1MB, volvemos a intentar con menor calidad
                      compress(quality - 0.1);
                    }
                  },
                  "image/jpeg", // siempre convertir a JPEG
                  quality
                );
            };

            compress(0.9);
        };
    };
};

export default resizeImage;