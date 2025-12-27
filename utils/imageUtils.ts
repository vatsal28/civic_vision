
export const createCompositeImage = (
  originalBase64: string,
  generatedBase64: string
): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const img1 = new Image();
    const img2 = new Image();
    
    let loaded = 0;
    const onLoaded = () => {
      loaded++;
      if (loaded === 2) {
        draw();
      }
    };

    img1.onload = onLoaded;
    img2.onload = onLoaded;
    img1.crossOrigin = "anonymous";
    img2.crossOrigin = "anonymous";
    
    img1.src = originalBase64;
    img2.src = generatedBase64;

    const draw = () => {
      const canvas = document.createElement('canvas');
      
      // Calculate standardized dimensions
      // Use the original image aspect ratio, but cap height to 2048px for performance/sharing
      const MAX_HEIGHT = 2048;
      let width = img1.width;
      let height = img1.height;

      if (height > MAX_HEIGHT) {
        const ratio = MAX_HEIGHT / height;
        height = MAX_HEIGHT;
        width = Math.round(width * ratio);
      }
      
      // Side-by-side canvas
      canvas.width = width * 2;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }

      // Fill background (safety)
      ctx.fillStyle = "#0f172a"; // Slate-900
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw images - Explicitly scale both to the calculated dimensions
      // This ensures the generated image (often 2K) stretches/shrinks to match the original's layout
      ctx.drawImage(img1, 0, 0, width, height);
      ctx.drawImage(img2, width, 0, width, height);

      // Gradient overlays for text readability
      const gradientHeight = height * 0.15;
      
      // Top gradient
      const topGrad = ctx.createLinearGradient(0, 0, 0, gradientHeight);
      topGrad.addColorStop(0, "rgba(0,0,0,0.6)");
      topGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, canvas.width, gradientHeight);

      // Bottom gradient
      const botGrad = ctx.createLinearGradient(0, height - gradientHeight, 0, height);
      botGrad.addColorStop(0, "rgba(0,0,0,0)");
      botGrad.addColorStop(1, "rgba(0,0,0,0.8)");
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, height - gradientHeight, canvas.width, gradientHeight);

      // Labels configuration
      const fontSize = Math.max(24, height / 25);
      const padding = Math.max(20, width / 40);
      
      ctx.font = `bold ${fontSize}px sans-serif`;
      
      // BEFORE Label (Top Left)
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.fillText("BEFORE", padding, padding + fontSize);

      // AFTER Label (Top Right of second image)
      ctx.fillStyle = "#22d3ee"; // Cyan-400
      ctx.fillText("CIVIC VISION", width + padding, padding + fontSize);

      // Footer/Branding
      ctx.font = `${Math.max(16, height / 40)}px sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.textAlign = "center";
      ctx.shadowBlur = 0;
      ctx.fillText("Generated with CivicVision AI", canvas.width / 2, height - (padding / 2));

      // Divider line
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = Math.max(2, width / 500);
      ctx.beginPath();
      ctx.moveTo(width, 0);
      ctx.lineTo(width, height);
      ctx.stroke();

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.85);
    };
  });
};
