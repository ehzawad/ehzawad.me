import React, { useEffect, useRef, useState } from 'react';
import './Homepage.css';

function Homepage() {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('hsl(0, 50%, 50%)');

  const handleRippleEffect = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    card.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 1500);
  };

  const paintColor = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    setTimeout(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, 1000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const intervalId = setInterval(() => {
      setColor((prevColor) => {
        const hue = (parseInt(prevColor.split(',')[0].split('(')[1]) + 60) % 360;
        return `hsl(${hue}, 50%, 50%)`;
      });
    }, 3000);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onMouseMove={paintColor}
        onTouchMove={paintColor}
      />
      <div className="flex justify-center items-center min-h-screen">
        <div className="card" onClick={handleRippleEffect}>
          <h1 className="card-text">
            Hi, I'm Zawad, a software Engineer, primarily work in AI domains.
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Homepage;