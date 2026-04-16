"use client";

import React, { useEffect, useRef } from "react";

export default function ParticleText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W: number, H: number, CX: number, CY: number, dpr: number;

    const N = 10000;
    const px = new Float32Array(N);
    const py = new Float32Array(N);
    const pz = new Float32Array(N);
    const vx = new Float32Array(N);
    const vy = new Float32Array(N);
    const vz = new Float32Array(N);
    const tx = new Float32Array(N);
    const ty = new Float32Array(N);
    const tz = new Float32Array(N);
    const ox = new Float32Array(N);
    const oy = new Float32Array(N);
    const oz = new Float32Array(N);
    const hue = new Float32Array(N);
    const phase = new Float32Array(N);

    let appState = 0; // 0 = sphere, 1 = forming word, 2 = word + repel active
    let mouseX = -9999;
    let mouseY = -9999;
    let t = 0;
    
    let reqId: number;
    let formTimeout: NodeJS.Timeout;

    const REPEL_RADIUS = 100;
    const REPEL_FORCE = 8;
    const PHI = Math.PI * (1 + Math.sqrt(5));

    let rotY = 0;
    const FOV = 550;
    const CAMERA_Z = 600;

    function initSphereTargets() {
      const baseDim = Math.min(W, H);
      const R = baseDim > 1200 ? baseDim * 0.28 : baseDim * 0.42;
      for (let i = 0; i < N; i++) {
        const polar = Math.acos(1 - 2 * (i + 0.5) / N);
        const azim = PHI * i;
        ox[i] = Math.sin(polar) * Math.cos(azim) * R;
        oy[i] = Math.sin(polar) * Math.sin(azim) * R;
        oz[i] = Math.cos(polar) * R;
        tx[i] = ox[i];
        ty[i] = oy[i];
        tz[i] = oz[i];
      }
    }

    function resize() {
      dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      CX = W / 2;
      CY = H / 2;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      ctx!.scale(dpr, dpr);
      if (appState === 0) initSphereTargets();
    }

    function initParticles() {
      for (let i = 0; i < N; i++) {
        px[i] = (Math.random() - 0.5) * W * 2;
        py[i] = (Math.random() - 0.5) * H * 2;
        pz[i] = (Math.random() - 0.5) * 1000;
        vx[i] = vy[i] = vz[i] = 0;
        hue[i] = (i / N) * 320 + 170;
        phase[i] = Math.random() * Math.PI * 2;
      }
    }

    function sampleTextPositions(phrase: string) {
      const cW = Math.floor(W);
      const cH = Math.floor(H);
      const off = document.createElement("canvas");
      off.width = cW;
      off.height = cH;
      const c2 = off.getContext("2d")!;

      const words = phrase.split(" ");
      const lines: string[] = [];
      let currentLine = "";
      const maxChars = phrase.length > 25 ? 12 : 20;

      words.forEach((word) => {
        if ((currentLine + word).length > maxChars) {
          lines.push(currentLine.trim());
          currentLine = word + " ";
        } else {
          currentLine += word + " ";
        }
      });
      lines.push(currentLine.trim());

      let fs = Math.min((cW * 0.72) / (maxChars * 0.5), (cH * 0.5) / lines.length, 180);
      if (phrase.length > 30) fs *= 0.8;

      c2.fillStyle = "#fff";
      c2.font = `900 ${fs}px Arial Black, Arial, sans-serif`;
      c2.textAlign = "center";
      c2.textBaseline = "middle";

      const lineHeight = fs * 1.1;
      const startY = cH / 2 - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, i) => {
        c2.fillText(line, cW / 2, startY + i * lineHeight);
      });

      const data = c2.getImageData(0, 0, cW, cH).data;
      const pts: number[] = [];
      const step = phrase.length > 30 ? 2 : 1;

      for (let y = 0; y < cH; y += step) {
        for (let x = 0; x < cW; x += step) {
          if (data[(y * cW + x) * 4 + 3] > 120) {
            pts.push(
              x - cW / 2 + (Math.random() - 0.5) * 0.8,
              y - cH / 2 + (Math.random() - 0.5) * 0.8
            );
          }
        }
      }

      for (let i = pts.length / 2 - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const ia = i * 2,
          ja = j * 2;
        let tmp = pts[ia];
        pts[ia] = pts[ja];
        pts[ja] = tmp;
        tmp = pts[ia + 1];
        pts[ia + 1] = pts[ja + 1];
        pts[ja + 1] = tmp;
      }

      return pts;
    }

    function formWord(phrase: string, isInterim = false) {
      if (!phrase.trim()) return;

      appState = 1;
      if (tipRef.current) tipRef.current.style.opacity = "0";
      if (statusRef.current) statusRef.current.textContent = isInterim ? "capturing..." : "sentence active";

      const pts = sampleTextPositions(phrase);
      const pCount = pts.length / 2;

      for (let i = 0; i < N; i++) {
        const idx = (i % pCount) * 2;
        tx[i] = pts[idx];
        ty[i] = pts[idx + 1];
        tz[i] = 0;
      }

      rotY = 0;
      t = 0;
      clearTimeout(formTimeout);
      if (!isInterim) {
        formTimeout = setTimeout(() => {
          appState = 2;
          if (statusRef.current) statusRef.current.textContent = "move cursor to repel";
          if (tipRef.current) tipRef.current.style.opacity = "1";
        }, 2000);
      }
    }

    function update() {
      t += 0.005;
      if (appState === 0) rotY += 0.006;
      const jitter = appState === 0 ? 1.8 : 0;

      for (let i = 0; i < N; i++) {
        const curTx = tx[i], curTy = ty[i], curTz = tz[i];
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

        let targetX = curTx * cosY - curTz * sinY;
        let targetY = curTy;
        let targetZ = curTx * sinY + curTz * cosY;

        if (appState === 0) {
          targetX += Math.sin(t * 8 + phase[i]) * jitter;
          targetY += Math.cos(t * 9 + phase[i]) * jitter;
          targetZ += Math.sin(t * 7 + phase[i] * 2) * jitter;
        }

        const sp = appState === 0 ? 0.02 : 0.022;
        vx[i] += (targetX - px[i]) * sp;
        vy[i] += (targetY - py[i]) * sp;
        vz[i] += (targetZ - pz[i]) * sp;

        if (appState >= 1 && mouseX > 0) {
          const MathScale = FOV / (FOV + pz[i] + CAMERA_Z);
          const sx = px[i] * MathScale + CX;
          const sy = py[i] * MathScale + CY;

          const rdx = sx - mouseX;
          const rdy = sy - mouseY;
          const d2 = rdx * rdx + rdy * rdy;
          if (d2 < REPEL_RADIUS * REPEL_RADIUS && d2 > 1) {
            const d = Math.sqrt(d2);
            const mag = REPEL_FORCE * (1 - d / REPEL_RADIUS) * 5;
            vx[i] += (rdx / d) * mag;
            vy[i] += (rdy / d) * mag;
          }
        }

        vx[i] *= 0.82;
        vy[i] *= 0.82;
        vz[i] *= 0.82;

        px[i] += vx[i];
        py[i] += vy[i];
        pz[i] += vz[i];
      }
    }

    function draw() {
      ctx!.fillStyle = "rgba(5,5,15,0.22)";
      ctx!.fillRect(0, 0, W, H);

      for (let i = 0; i < N; i++) {
        const zPos = pz[i] + CAMERA_Z;
        if (zPos < 10) continue;

        const scale = FOV / zPos;
        const sx = px[i] * scale + CX;
        const sy = py[i] * scale + CY;

        const spd = Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i] + vz[i] * vz[i]);
        let a = Math.min(1, (0.18 + spd * 0.1) * (scale * 0.65));
        let size = (0.4 + spd * 0.12) * scale;
        let h, s, l;

        if (appState >= 1) {
          h = 190;
          s = 90;
          l = 85;
          a = Math.min(1, a * 1.5);
          size *= 0.9;
        } else {
          h = (hue[i] + t * 25) % 360;
          s = 80;
          l = 70;
        }

        ctx!.beginPath();
        ctx!.arc(sx, sy, size, 0, 6.2832);
        ctx!.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
        ctx!.fill();
      }

      if (appState >= 1 && mouseX > 0) {
        const r = REPEL_RADIUS;
        const grd = ctx!.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, r);
        grd.addColorStop(0, "rgba(255,255,255,0.05)");
        grd.addColorStop(1, "rgba(255,255,255,0)");
        ctx!.beginPath();
        ctx!.arc(mouseX, mouseY, r, 0, 6.2832);
        ctx!.fillStyle = grd;
        ctx!.fill();
      }
    }

    function loop() {
      update();
      draw();
      reqId = requestAnimationFrame(loop);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    const handleDoubleClick = () => {
      appState = 0;
      initSphereTargets();
      if (statusRef.current) statusRef.current.textContent = "interactive sphere ready";
      if (tipRef.current) tipRef.current.style.opacity = "0";
      if (inputRef.current) inputRef.current.value = "";
      if (transcriptRef.current) transcriptRef.current.textContent = "";
    };

    const handleInput = () => {
      if (!inputRef.current) return;
      const s = inputRef.current.value.trim();
      if (s) {
        if (transcriptRef.current) transcriptRef.current.textContent = s;
        formWord(s, true);
      } else {
        if (transcriptRef.current) transcriptRef.current.textContent = "";
        initSphereTargets();
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("dblclick", handleDoubleClick);
    if (inputRef.current) inputRef.current.addEventListener("input", handleInput);

    window.addEventListener("resize", () => {
      ctx!.resetTransform();
      resize();
    });

    resize();
    initParticles();
    loop();

    return () => {
      cancelAnimationFrame(reqId);
      clearTimeout(formTimeout);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("dblclick", handleDoubleClick);
      if (inputRef.current) inputRef.current.removeEventListener("input", handleInput);
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-[#05050f] rounded-2xl">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-none" />

      <div className="absolute bottom-[32px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[10px] z-10 w-full px-4">
        <div 
          ref={transcriptRef} 
          className="mb-[12px] text-white/85 text-[18px] font-medium text-center max-w-[400px] drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] min-h-[1.5em] leading-[1.4]"
        />
        
        <div className="flex gap-[8px] items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="type a phrase here..."
            maxLength={100}
            className="bg-white/5 border border-white/20 text-white px-[16px] py-[9px] rounded-full text-[14px] outline-none w-[200px] sm:w-[250px] font-sans placeholder:text-white/30 focus:border-white/40 transition-colors"
          />
        </div>
        
        <div ref={statusRef} className="text-white/45 text-[13px] font-sans text-center whitespace-nowrap">
          interactive sphere ready
        </div>
        
        <div ref={tipRef} className="text-white/20 text-[11px] font-sans opacity-0 transition-opacity duration-500">
          move cursor over word to repel &bull; double-click to reset
        </div>
      </div>

      <div className="absolute top-[20px] right-[20px] text-white/15 text-[11px] font-sans flex items-center gap-[8px]">
        <span>double-click to reset</span>
      </div>
    </div>
  );
}
