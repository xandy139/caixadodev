/**
 * Caixa do Dev - Webcam & Microphone Diagnostic Engine (100% Client-Side)
 * WebRTC MediaDevices API + Web Audio API AnalyserNode + HTML5 Canvas + MediaRecorder
 * Processamento estritamente local na memória do navegador (Zero transmissão para servidores)
 */

(function () {
  const isEn = () => document.documentElement.lang === 'en';

  const t = (pt, en) => (isEn() ? en : pt);

  function notify(msg) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg);
    } else {
      const toastEl = document.getElementById('toast');
      if (toastEl) {
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        setTimeout(() => toastEl.classList.remove('show'), 2600);
      }
    }
  }

  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }

  function getAspectRatioLabel(w, h) {
    if (!w || !h) return '-';
    const divisor = gcd(w, h);
    const rw = w / divisor;
    const rh = h / divisor;
    const ratio = (w / h).toFixed(2);
    if (Math.abs(w / h - 16 / 9) < 0.03) return `16:9 (${ratio})`;
    if (Math.abs(w / h - 4 / 3) < 0.03) return `4:3 (${ratio})`;
    if (Math.abs(w / h - 16 / 10) < 0.03) return `16:10 (${ratio})`;
    if (Math.abs(w / h - 21 / 9) < 0.05) return `21:9 (${ratio})`;
    if (w === h) return `1:1 (1.00)`;
    return `${rw}:${rh} (${ratio})`;
  }

  function getResolutionTier(w, h) {
    const maxDim = Math.max(w || 0, h || 0);
    if (maxDim >= 3840) return '4K UHD (2160p)';
    if (maxDim >= 2560) return '2K QHD (1440p)';
    if (maxDim >= 1920) return 'Full HD (1080p)';
    if (maxDim >= 1280) return 'HD (720p)';
    if (maxDim >= 640) return 'SD / VGA (480p)';
    return t('Baixa Resolução', 'Low Resolution');
  }

  // ==========================================
  // 1. WEBCAM TEST CONTROLLER
  // ==========================================
  function initWebcamTest() {
    const root = document.getElementById('webcam-test-root');
    if (!root) return;

    const videoEl = document.getElementById('webcam-video');
    const stageOverlay = document.getElementById('webcam-stage-overlay');
    const gridOverlay = document.getElementById('webcam-grid-overlay');
    const liveBadge = document.getElementById('webcam-live-badge');
    const liveSpecsBadge = document.getElementById('webcam-live-specs');
    const errorBox = document.getElementById('webcam-error-box');
    const errorText = document.getElementById('webcam-error-text');

    const btnStart = document.getElementById('btn-webcam-start');
    const btnStartHero = document.getElementById('btn-webcam-start-hero');
    const btnStop = document.getElementById('btn-webcam-stop');
    const btnMirror = document.getElementById('btn-webcam-mirror');
    const btnGrid = document.getElementById('btn-webcam-grid');
    const btnPause = document.getElementById('btn-webcam-pause');
    const btnFullscreen = document.getElementById('btn-webcam-fullscreen');
    const btnSnapshot = document.getElementById('btn-webcam-snapshot');

    const selDevice = document.getElementById('sel-webcam-device');
    const selResolution = document.getElementById('sel-webcam-resolution');

    const snapshotPanel = document.getElementById('webcam-snapshot-panel');
    const snapshotImg = document.getElementById('webcam-snapshot-img');
    const btnDownloadSnap = document.getElementById('btn-webcam-download-snap');
    const snapshotMeta = document.getElementById('webcam-snapshot-meta');

    // Telemetry cells
    const tdStatus = document.getElementById('cam-td-status');
    const tdDevice = document.getElementById('cam-td-device');
    const tdRes = document.getElementById('cam-td-res');
    const tdTier = document.getElementById('cam-td-tier');
    const tdAspect = document.getElementById('cam-td-aspect');
    const tdFps = document.getElementById('cam-td-fps');
    const tdMp = document.getElementById('cam-td-mp');
    const tdFacing = document.getElementById('cam-td-facing');

    let currentStream = null;
    let isMirrored = true;
    let isGridVisible = false;
    let isPaused = false;
    let fpsCounter = 0;
    let currentFps = 0;
    let lastFpsTime = performance.now();
    let fpsRafId = null;

    async function refreshCameraList(selectedId) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        selDevice.innerHTML = '';
        if (videoInputs.length === 0) {
          const opt = document.createElement('option');
          opt.value = '';
          opt.textContent = t('Nenhuma câmera detectada', 'No camera detected');
          selDevice.appendChild(opt);
          return;
        }
        videoInputs.forEach((dev, idx) => {
          const opt = document.createElement('option');
          opt.value = dev.deviceId;
          opt.textContent = dev.label || `${t('Câmera', 'Camera')} #${idx + 1}`;
          if (selectedId && dev.deviceId === selectedId) {
            opt.selected = true;
          }
          selDevice.appendChild(opt);
        });
      } catch (_) {}
    }

    function stopFpsLoop() {
      if (fpsRafId) {
        cancelAnimationFrame(fpsRafId);
        fpsRafId = null;
      }
    }

    function startFpsLoop() {
      stopFpsLoop();
      fpsCounter = 0;
      lastFpsTime = performance.now();

      const updateTelemetryFps = () => {
        const now = performance.now();
        const elapsed = (now - lastFpsTime) / 1000;
        if (elapsed >= 1.0) {
          currentFps = Math.round(fpsCounter / elapsed);
          fpsCounter = 0;
          lastFpsTime = now;
          updateTelemetryUI();
        }
      };

      if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
        const onFrame = () => {
          if (!currentStream) return;
          if (!isPaused) fpsCounter++;
          updateTelemetryFps();
          videoEl.requestVideoFrameCallback(onFrame);
        };
        videoEl.requestVideoFrameCallback(onFrame);
      } else {
        let lastVideoTime = -1;
        const loop = () => {
          if (!currentStream) return;
          if (!isPaused && videoEl.currentTime !== lastVideoTime) {
            lastVideoTime = videoEl.currentTime;
            fpsCounter++;
          }
          updateTelemetryFps();
          fpsRafId = requestAnimationFrame(loop);
        };
        fpsRafId = requestAnimationFrame(loop);
      }
    }

    function updateTelemetryUI() {
      if (!currentStream) return;
      const track = currentStream.getVideoTracks()[0];
      if (!track) return;

      const settings = track.getSettings ? track.getSettings() : {};
      const w = videoEl.videoWidth || settings.width || 0;
      const h = videoEl.videoHeight || settings.height || 0;
      const targetFps = settings.frameRate ? Math.round(settings.frameRate) : '-';
      const displayFps = currentFps > 0 ? currentFps : targetFps;
      const mp = w && h ? ((w * h) / 1000000).toFixed(2) + ' MP' : '-';
      const aspect = getAspectRatioLabel(w, h);
      const tier = w && h ? getResolutionTier(w, h) : '-';

      if (tdStatus) {
        tdStatus.innerHTML = `<span style="color: #34d399; font-weight: 700;">● ${t('Ativa (Local)', 'Active (Local)')}</span>`;
      }
      if (tdDevice) tdDevice.textContent = track.label || t('Webcam Padrão', 'Default Webcam');
      if (tdRes) tdRes.textContent = w && h ? `${w} × ${h} px` : '-';
      if (tdTier) tdTier.textContent = tier;
      if (tdAspect) tdAspect.textContent = aspect;
      if (tdFps) tdFps.textContent = displayFps !== '-' ? `${displayFps} FPS (Alvo: ${targetFps})` : '-';
      if (tdMp) tdMp.textContent = mp;
      if (tdFacing) {
        const fm = settings.facingMode;
        tdFacing.textContent = fm === 'user'
          ? t('Frontal (User)', 'Front (User)')
          : fm === 'environment'
            ? t('Traseira (Environment)', 'Rear (Environment)')
            : t('Webcam USB / Integrada', 'USB / Integrated Webcam');
      }

      if (liveSpecsBadge && w && h) {
        liveSpecsBadge.textContent = `${w}×${h} • ${displayFps} FPS`;
        liveSpecsBadge.style.display = 'inline-flex';
      }
    }

    function stopCamera() {
      stopFpsLoop();
      if (currentStream) {
        currentStream.getTracks().forEach(tr => tr.stop());
        currentStream = null;
      }
      if (videoEl) {
        videoEl.srcObject = null;
      }
      isPaused = false;
      currentFps = 0;

      if (stageOverlay) stageOverlay.style.display = 'flex';
      if (liveBadge) liveBadge.style.display = 'none';
      if (liveSpecsBadge) liveSpecsBadge.style.display = 'none';
      if (btnStop) btnStop.disabled = true;
      if (btnPause) {
        btnPause.disabled = true;
        btnPause.textContent = t('Congelar', 'Freeze');
      }
      if (btnSnapshot) btnSnapshot.disabled = true;
      if (btnFullscreen) btnFullscreen.disabled = true;
      if (btnStart) btnStart.textContent = t('Iniciar Câmera', 'Start Camera');
      if (tdStatus) tdStatus.textContent = t('Aguardando início', 'Waiting to start');
    }

    async function startCamera() {
      if (errorBox) errorBox.style.display = 'none';
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (errorBox && errorText) {
          errorText.textContent = t(
            'Seu navegador não suporta a API WebRTC (navigator.mediaDevices.getUserMedia) ou a página não está em contexto seguro (HTTPS).',
            'Your browser does not support the WebRTC API (navigator.mediaDevices.getUserMedia) or the page is not in a secure context (HTTPS).'
          );
          errorBox.style.display = 'block';
        }
        return;
      }

      stopCamera();

      const chosenDeviceId = selDevice && selDevice.value ? selDevice.value : '';
      const resPreset = selResolution ? selResolution.value : 'auto';

      const videoConstraints = {};
      if (chosenDeviceId) {
        videoConstraints.deviceId = { exact: chosenDeviceId };
      }

      if (resPreset === '720p') {
        videoConstraints.width = { ideal: 1280 };
        videoConstraints.height = { ideal: 720 };
      } else if (resPreset === '1080p') {
        videoConstraints.width = { ideal: 1920 };
        videoConstraints.height = { ideal: 1080 };
      } else if (resPreset === '4k') {
        videoConstraints.width = { ideal: 3840 };
        videoConstraints.height = { ideal: 2160 };
      } else if (resPreset === '480p') {
        videoConstraints.width = { ideal: 640 };
        videoConstraints.height = { ideal: 480 };
      } else {
        videoConstraints.width = { ideal: 1920 };
        videoConstraints.height = { ideal: 1080 };
      }

      try {
        btnStart.disabled = true;
        if (btnStartHero) btnStartHero.disabled = true;

        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: Object.keys(videoConstraints).length ? videoConstraints : true,
            audio: false
          });
        } catch (firstErr) {
          // Fallback para constraints básicas caso o deviceId ou resolução falhe
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }

        currentStream = stream;
        videoEl.srcObject = stream;
        await videoEl.play();

        const activeTrack = stream.getVideoTracks()[0];
        const activeSettings = activeTrack && activeTrack.getSettings ? activeTrack.getSettings() : {};
        await refreshCameraList(activeSettings.deviceId);

        if (stageOverlay) stageOverlay.style.display = 'none';
        if (liveBadge) liveBadge.style.display = 'inline-flex';
        if (btnStop) btnStop.disabled = false;
        if (btnPause) btnPause.disabled = false;
        if (btnSnapshot) btnSnapshot.disabled = false;
        if (btnFullscreen) btnFullscreen.disabled = false;
        if (btnStart) btnStart.textContent = t('Reiniciar Câmera', 'Restart Camera');

        updateTelemetryUI();
        startFpsLoop();
        notify(t('Câmera conectada com sucesso!', 'Camera connected successfully!'));
      } catch (err) {
        let friendly = err.message || String(err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          friendly = t(
            'Permissão negada! Clique no ícone de cadeado/câmera na barra de endereços do navegador e permita o acesso à câmera.',
            'Permission denied! Click the lock/camera icon in your browser address bar and allow camera access.'
          );
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          friendly = t(
            'Nenhuma webcam foi encontrada conectada ao seu computador ou dispositivo.',
            'No webcam was found connected to your computer or device.'
          );
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          friendly = t(
            'Sua câmera já está sendo usada exclusivamente por outro aplicativo (Zoom, Teams, OBS, Discord). Feche o outro programa e tente novamente.',
            'Your camera is currently in exclusive use by another application (Zoom, Teams, OBS, Discord). Close the other app and try again.'
          );
        }
        if (errorBox && errorText) {
          errorText.textContent = friendly;
          errorBox.style.display = 'block';
        }
        if (tdStatus) {
          tdStatus.innerHTML = `<span style="color: #f87171; font-weight: 700;">✕ ${t('Erro / Bloqueada', 'Error / Blocked')}</span>`;
        }
      } finally {
        btnStart.disabled = false;
        if (btnStartHero) btnStartHero.disabled = false;
      }
    }

    function takeSnapshot() {
      if (!currentStream || !videoEl.videoWidth) return;
      const w = videoEl.videoWidth;
      const h = videoEl.videoHeight;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      if (isMirrored) {
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(videoEl, 0, 0, w, h);

      const dataUrl = canvas.toDataURL('image/png');
      if (snapshotImg) snapshotImg.src = dataUrl;
      if (btnDownloadSnap) {
        btnDownloadSnap.href = dataUrl;
        btnDownloadSnap.download = `snapshot-webcam-${w}x${h}-${Date.now()}.png`;
      }
      if (snapshotMeta) {
        snapshotMeta.textContent = `${w} × ${h} px (${getResolutionTier(w, h)}) • PNG`;
      }
      if (snapshotPanel) {
        snapshotPanel.style.display = 'block';
        snapshotPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      notify(t('Foto capturada localmente! 📸', 'Snapshot captured locally! 📸'));
    }

    if (btnStart) btnStart.addEventListener('click', startCamera);
    if (btnStartHero) btnStartHero.addEventListener('click', startCamera);
    if (btnStop) btnStop.addEventListener('click', () => {
      stopCamera();
      notify(t('Câmera desligada.', 'Camera stopped.'));
    });

    if (selDevice) {
      selDevice.addEventListener('change', () => {
        if (currentStream) startCamera();
      });
    }
    if (selResolution) {
      selResolution.addEventListener('change', () => {
        if (currentStream) startCamera();
      });
    }

    if (btnMirror) {
      btnMirror.addEventListener('click', () => {
        isMirrored = !isMirrored;
        videoEl.style.transform = isMirrored ? 'scaleX(-1)' : 'scaleX(1)';
        btnMirror.classList.toggle('active', isMirrored);
      });
    }

    if (btnGrid) {
      btnGrid.addEventListener('click', () => {
        isGridVisible = !isGridVisible;
        if (gridOverlay) gridOverlay.style.display = isGridVisible ? 'block' : 'none';
        btnGrid.classList.toggle('active', isGridVisible);
      });
    }

    if (btnPause) {
      btnPause.addEventListener('click', () => {
        if (!currentStream) return;
        if (isPaused) {
          videoEl.play();
          isPaused = false;
          btnPause.textContent = t('Congelar', 'Freeze');
        } else {
          videoEl.pause();
          isPaused = true;
          btnPause.textContent = t('Retomar', 'Resume');
        }
      });
    }

    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        const stage = document.getElementById('webcam-stage');
        if (!stage) return;
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (stage.requestFullscreen) {
          stage.requestFullscreen();
        }
      });
    }

    if (btnSnapshot) {
      btnSnapshot.addEventListener('click', takeSnapshot);
    }

    videoEl.addEventListener('loadedmetadata', updateTelemetryUI);
    videoEl.addEventListener('resize', updateTelemetryUI);

    refreshCameraList();
    window.addEventListener('beforeunload', stopCamera);
  }

  // ==========================================
  // 2. MICROPHONE TEST CONTROLLER
  // ==========================================
  function initMicrophoneTest() {
    const root = document.getElementById('mic-test-root');
    if (!root) return;

    const canvas = document.getElementById('mic-visualizer-canvas');
    const stageOverlay = document.getElementById('mic-stage-overlay');
    const errorBox = document.getElementById('mic-error-box');
    const errorText = document.getElementById('mic-error-text');

    const btnStart = document.getElementById('btn-mic-start');
    const btnStartHero = document.getElementById('btn-mic-start-hero');
    const btnStop = document.getElementById('btn-mic-stop');
    const btnModeFft = document.getElementById('btn-mic-mode-fft');
    const btnModeWave = document.getElementById('btn-mic-mode-wave');
    const btnRecord = document.getElementById('btn-mic-record');

    const selDevice = document.getElementById('sel-mic-device');
    const chkEcho = document.getElementById('chk-mic-echo');
    const chkNoise = document.getElementById('chk-mic-noise');
    const chkAgc = document.getElementById('chk-mic-agc');

    // Meters
    const volBarFill = document.getElementById('mic-vol-bar-fill');
    const volPercentEl = document.getElementById('mic-vol-percent');
    const volDbEl = document.getElementById('mic-vol-db');
    const peakPercentEl = document.getElementById('mic-peak-percent');
    const statusBadge = document.getElementById('mic-signal-badge');

    // Recording playback panel
    const playbackPanel = document.getElementById('mic-playback-panel');
    const audioPlayer = document.getElementById('mic-audio-player');
    const btnDownloadAudio = document.getElementById('btn-mic-download-audio');

    // Telemetry cells
    const tdStatus = document.getElementById('mic-td-status');
    const tdDevice = document.getElementById('mic-td-device');
    const tdSampleRate = document.getElementById('mic-td-samplerate');
    const tdChannels = document.getElementById('mic-td-channels');
    const tdLatency = document.getElementById('mic-td-latency');
    const tdDsp = document.getElementById('mic-td-dsp');

    let currentStream = null;
    let audioCtx = null;
    let analyser = null;
    let sourceNode = null;
    let rafId = null;
    let vizMode = 'fft'; // 'fft' or 'wave'
    let maxPeak = 0;

    let mediaRecorder = null;
    let recordedChunks = [];
    let isRecording = false;
    let recordTimerId = null;

    async function refreshMicList(selectedId) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(d => d.kind === 'audioinput');
        selDevice.innerHTML = '';
        if (audioInputs.length === 0) {
          const opt = document.createElement('option');
          opt.value = '';
          opt.textContent = t('Nenhum microfone detectado', 'No microphone detected');
          selDevice.appendChild(opt);
          return;
        }
        audioInputs.forEach((dev, idx) => {
          const opt = document.createElement('option');
          opt.value = dev.deviceId;
          opt.textContent = dev.label || `${t('Microfone', 'Microphone')} #${idx + 1}`;
          if (selectedId && dev.deviceId === selectedId) {
            opt.selected = true;
          }
          selDevice.appendChild(opt);
        });
      } catch (_) {}
    }

    function stopVisualizerLoop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function drawIdleCanvas() {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
    }

    function startVisualizerLoop() {
      stopVisualizerLoop();
      if (!analyser || !canvas) return;

      const ctx = canvas.getContext('2d');
      const bufferLength = analyser.frequencyBinCount;
      const timeData = new Uint8Array(bufferLength);
      const freqData = new Uint8Array(bufferLength);

      const render = () => {
        if (!currentStream || !analyser) return;

        analyser.getByteTimeDomainData(timeData);
        analyser.getByteFrequencyData(freqData);

        // Calculate RMS volume & dBFS
        let sumSquares = 0;
        let instantPeak = 0;
        for (let i = 0; i < bufferLength; i++) {
          const normalized = (timeData[i] - 128) / 128;
          const absVal = Math.abs(normalized);
          sumSquares += normalized * normalized;
          if (absVal > instantPeak) instantPeak = absVal;
        }
        const rms = Math.sqrt(sumSquares / bufferLength);
        const db = rms > 0.0001 ? Math.max(-60, Math.round(20 * Math.log10(rms))) : -60;
        const pct = Math.min(100, Math.round(rms * 280));

        if (pct > maxPeak) {
          maxPeak = pct;
          if (peakPercentEl) peakPercentEl.textContent = `${maxPeak}%`;
        }

        if (volBarFill) {
          volBarFill.style.width = `${pct}%`;
          if (pct > 88 || instantPeak > 0.96) {
            volBarFill.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
          } else if (pct > 8) {
            volBarFill.style.background = 'linear-gradient(90deg, #6366f1, #10b981)';
          } else {
            volBarFill.style.background = 'var(--accent-primary)';
          }
        }
        if (volPercentEl) volPercentEl.textContent = `${pct}%`;
        if (volDbEl) volDbEl.textContent = `${db} dBFS`;

        if (statusBadge) {
          if (instantPeak > 0.96 || pct > 90) {
            statusBadge.textContent = t('⚠️ Áudio Estourando (Clipping)', '⚠️ Audio Clipping (Too Loud)');
            statusBadge.style.background = 'rgba(239, 68, 68, 0.18)';
            statusBadge.style.color = '#f87171';
            statusBadge.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          } else if (pct >= 8) {
            statusBadge.textContent = t('✓ Som Detectado (Sinal Bom)', '✓ Sound Detected (Good Signal)');
            statusBadge.style.background = 'rgba(16, 185, 129, 0.18)';
            statusBadge.style.color = '#34d399';
            statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
          } else {
            statusBadge.textContent = t('Aguardando fala / Silêncio...', 'Waiting for speech / Silence...');
            statusBadge.style.background = 'rgba(99, 102, 241, 0.14)';
            statusBadge.style.color = '#a5b4fc';
            statusBadge.style.borderColor = 'rgba(99, 102, 241, 0.3)';
          }
        }

        // Draw Canvas
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Background subtle grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        for (let gx = 0; gx < w; gx += 60) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, h);
          ctx.stroke();
        }
        for (let gy = 0; gy < h; gy += 45) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(w, gy);
          ctx.stroke();
        }

        if (vizMode === 'fft') {
          const barCount = 64;
          const step = Math.floor((bufferLength * 0.65) / barCount);
          const barWidth = (w / barCount) - 3;

          for (let i = 0; i < barCount; i++) {
            const val = freqData[i * step] || 0;
            const percent = val / 255;
            const barHeight = Math.max(4, percent * (h - 20));
            const x = i * (barWidth + 3);
            const y = h - barHeight;

            const grad = ctx.createLinearGradient(0, h, 0, 0);
            grad.addColorStop(0, '#6366f1');
            grad.addColorStop(0.6, '#06b6d4');
            grad.addColorStop(1, '#10b981');

            ctx.fillStyle = grad;
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(x, y, barWidth, barHeight, 4);
            } else {
              ctx.rect(x, y, barWidth, barHeight);
            }
            ctx.fill();
          }
        } else {
          // Oscilloscope Waveform
          ctx.lineWidth = 2.8;
          const grad = ctx.createLinearGradient(0, 0, w, 0);
          grad.addColorStop(0, '#6366f1');
          grad.addColorStop(0.5, '#06b6d4');
          grad.addColorStop(1, '#10b981');
          ctx.strokeStyle = grad;
          ctx.beginPath();

          const sliceWidth = w / bufferLength;
          let x = 0;
          for (let i = 0; i < bufferLength; i++) {
            const v = timeData[i] / 128.0;
            const y = (v * h) / 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            x += sliceWidth;
          }
          ctx.lineTo(w, h / 2);
          ctx.stroke();
        }

        rafId = requestAnimationFrame(render);
      };

      rafId = requestAnimationFrame(render);
    }

    function stopMicrophone() {
      stopVisualizerLoop();
      if (recordTimerId) {
        clearTimeout(recordTimerId);
        recordTimerId = null;
      }
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        try { mediaRecorder.stop(); } catch (_) {}
      }
      isRecording = false;

      if (sourceNode) {
        try { sourceNode.disconnect(); } catch (_) {}
        sourceNode = null;
      }
      if (audioCtx) {
        try { audioCtx.close(); } catch (_) {}
        audioCtx = null;
      }
      if (currentStream) {
        currentStream.getTracks().forEach(tr => tr.stop());
        currentStream = null;
      }

      drawIdleCanvas();
      if (stageOverlay) stageOverlay.style.display = 'flex';
      if (btnStop) btnStop.disabled = true;
      if (btnRecord) {
        btnRecord.disabled = true;
        btnRecord.textContent = t('● Gravar Teste de Voz (5s)', '● Record Voice Test (5s)');
      }
      if (btnStart) btnStart.textContent = t('Iniciar Microfone', 'Start Microphone');
      if (volBarFill) volBarFill.style.width = '0%';
      if (volPercentEl) volPercentEl.textContent = '0%';
      if (volDbEl) volDbEl.textContent = '-60 dBFS';
      if (tdStatus) tdStatus.textContent = t('Aguardando início', 'Waiting to start');
    }

    async function startMicrophone() {
      if (errorBox) errorBox.style.display = 'none';
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (errorBox && errorText) {
          errorText.textContent = t(
            'Seu navegador não suporta a API WebRTC (getUserMedia) ou não está em contexto HTTPS.',
            'Your browser does not support the WebRTC API (getUserMedia) or is not in an HTTPS context.'
          );
          errorBox.style.display = 'block';
        }
        return;
      }

      stopMicrophone();
      maxPeak = 0;
      if (peakPercentEl) peakPercentEl.textContent = '0%';

      const chosenDeviceId = selDevice && selDevice.value ? selDevice.value : '';
      const audioConstraints = {
        echoCancellation: chkEcho ? chkEcho.checked : true,
        noiseSuppression: chkNoise ? chkNoise.checked : true,
        autoGainControl: chkAgc ? chkAgc.checked : true
      };
      if (chosenDeviceId) {
        audioConstraints.deviceId = { exact: chosenDeviceId };
      }

      try {
        btnStart.disabled = true;
        if (btnStartHero) btnStartHero.disabled = true;

        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints, video: false });
        } catch (_) {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        }

        currentStream = stream;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }

        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.82;

        sourceNode = audioCtx.createMediaStreamSource(stream);
        sourceNode.connect(analyser);

        const track = stream.getAudioTracks()[0];
        const settings = track && track.getSettings ? track.getSettings() : {};
        await refreshMicList(settings.deviceId);

        if (stageOverlay) stageOverlay.style.display = 'none';
        if (btnStop) btnStop.disabled = false;
        if (btnRecord) btnRecord.disabled = false;
        if (btnStart) btnStart.textContent = t('Reiniciar Microfone', 'Restart Microphone');

        // Update telemetry table
        if (tdStatus) {
          tdStatus.innerHTML = `<span style="color: #34d399; font-weight: 700;">● ${t('Capturando (Local)', 'Capturing (Local)')}</span>`;
        }
        if (tdDevice) tdDevice.textContent = (track && track.label) || t('Microfone Padrão', 'Default Microphone');
        if (tdSampleRate) {
          const sr = settings.sampleRate || audioCtx.sampleRate;
          tdSampleRate.textContent = sr ? `${sr} Hz (${(sr / 1000).toFixed(1)} kHz)` : '-';
        }
        if (tdChannels) {
          const ch = settings.channelCount || 1;
          tdChannels.textContent = ch === 2 ? '2 (Estéreo / Stereo)' : '1 (Mono)';
        }
        if (tdLatency) {
          const lat = settings.latency || audioCtx.baseLatency;
          tdLatency.textContent = typeof lat === 'number' ? `${Math.round(lat * 1000)} ms` : '< 20 ms';
        }
        if (tdDsp) {
          const dspList = [];
          if (settings.echoCancellation ?? (chkEcho && chkEcho.checked)) dspList.push('EchoCancel');
          if (settings.noiseSuppression ?? (chkNoise && chkNoise.checked)) dspList.push('NoiseSuppress');
          if (settings.autoGainControl ?? (chkAgc && chkAgc.checked)) dspList.push('AutoGain');
          tdDsp.textContent = dspList.length ? dspList.join(' + ') : t('Desativado (Raw Audio)', 'Disabled (Raw Audio)');
        }

        startVisualizerLoop();
        notify(t('Microfone ativo! Fale para testar.', 'Microphone active! Speak to test.'));
      } catch (err) {
        let friendly = err.message || String(err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          friendly = t(
            'Permissão negada! Clique no ícone de cadeado/microfone na barra de endereços do navegador e permita o uso do microfone.',
            'Permission denied! Click the lock/microphone icon in your browser address bar and allow microphone access.'
          );
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          friendly = t(
            'Nenhum microfone foi encontrado conectado ao seu dispositivo.',
            'No microphone was found connected to your device.'
          );
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          friendly = t(
            'O microfone está ocupado ou bloqueado pelo sistema operacional. Verifique as configurações de privacidade do Windows/macOS.',
            'Your microphone is busy or blocked by the OS. Check your Windows/macOS microphone privacy settings.'
          );
        }
        if (errorBox && errorText) {
          errorText.textContent = friendly;
          errorBox.style.display = 'block';
        }
        if (tdStatus) {
          tdStatus.innerHTML = `<span style="color: #f87171; font-weight: 700;">✕ ${t('Erro / Bloqueado', 'Error / Blocked')}</span>`;
        }
      } finally {
        btnStart.disabled = false;
        if (btnStartHero) btnStartHero.disabled = false;
      }
    }

    function toggleRecording() {
      if (!currentStream) return;
      if (isRecording && mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        return;
      }

      if (typeof MediaRecorder === 'undefined') {
        notify(t('Seu navegador não suporta gravação MediaRecorder.', 'Your browser does not support MediaRecorder.'));
        return;
      }

      recordedChunks = [];
      try {
        mediaRecorder = new MediaRecorder(currentStream);
      } catch (e) {
        notify(t('Erro ao iniciar gravador de áudio.', 'Failed to initialize audio recorder.'));
        return;
      }

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        isRecording = false;
        if (recordTimerId) {
          clearTimeout(recordTimerId);
          recordTimerId = null;
        }
        if (btnRecord) {
          btnRecord.textContent = t('● Gravar Teste de Voz (5s)', '● Record Voice Test (5s)');
          btnRecord.classList.remove('btn-danger-pulse');
        }
        if (recordedChunks.length === 0) return;

        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(recordedChunks, { type: mimeType });
        const url = URL.createObjectURL(blob);

        if (audioPlayer) {
          audioPlayer.src = url;
          audioPlayer.play().catch(() => {});
        }
        if (btnDownloadAudio) {
          btnDownloadAudio.href = url;
          const ext = mimeType.includes('mp4') ? 'm4a' : mimeType.includes('ogg') ? 'ogg' : 'webm';
          btnDownloadAudio.download = `teste-microfone-${Date.now()}.${ext}`;
        }
        if (playbackPanel) {
          playbackPanel.style.display = 'block';
          playbackPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        notify(t('Gravação concluída! Reproduzindo áudio... 🎧', 'Recording complete! Playing back audio... 🎧'));
      };

      isRecording = true;
      mediaRecorder.start();
      if (btnRecord) {
        btnRecord.textContent = t('⏹ Parar Gravação Agora (Gravando...)', '⏹ Stop Recording Now (Recording...)');
      }

      recordTimerId = setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 5000);
    }

    if (btnStart) btnStart.addEventListener('click', startMicrophone);
    if (btnStartHero) btnStartHero.addEventListener('click', startMicrophone);
    if (btnStop) btnStop.addEventListener('click', () => {
      stopMicrophone();
      notify(t('Microfone desligado.', 'Microphone stopped.'));
    });

    if (selDevice) {
      selDevice.addEventListener('change', () => {
        if (currentStream) startMicrophone();
      });
    }
    [chkEcho, chkNoise, chkAgc].forEach(chk => {
      if (chk) {
        chk.addEventListener('change', () => {
          if (currentStream) startMicrophone();
        });
      }
    });

    if (btnModeFft) {
      btnModeFft.addEventListener('click', () => {
        vizMode = 'fft';
        btnModeFft.classList.add('active');
        if (btnModeWave) btnModeWave.classList.remove('active');
      });
    }
    if (btnModeWave) {
      btnModeWave.addEventListener('click', () => {
        vizMode = 'wave';
        btnModeWave.classList.add('active');
        if (btnModeFft) btnModeFft.classList.remove('active');
      });
    }
    if (btnRecord) {
      btnRecord.addEventListener('click', toggleRecording);
    }

    drawIdleCanvas();
    refreshMicList();
    window.addEventListener('beforeunload', stopMicrophone);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initWebcamTest();
    initMicrophoneTest();
  });
})();
