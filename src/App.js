// App.jsx
import { useEffect, useRef, useState } from 'react';
import { bootstrapCameraKit } from '@snap/camera-kit';

const App = () => {
  const canvasRef = useRef(null);
  const camKitRef = useRef(null);
  const sessionRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (initialized.current) return; // prevent re-initialization
      initialized.current = true;
      const cameraKit = await bootstrapCameraKit({
        apiToken: '',
      });
      const liveRenderTarget = document.getElementById('canvas');
      const session = await cameraKit.createSession({ liveRenderTarget });
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      camKitRef.current = cameraKit;
      sessionRef.current = session;
      await session.setSource(mediaStream);
      await session.play();
      const lens = await camKitRef.current.lensRepository.loadLens("LENS_ID", "LENS_GROUP_ID");
      await sessionRef.current.applyLens(lens);
    };
    init();
  }, []);
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '2rem',
        flexDirection: 'column',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        width='640'
        height='480'
        style={{ border: '1px solid black', width: 640, height: 480 }}
        id='canvas'
      />
    </div>
  );
};

export default App;
