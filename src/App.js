// App.jsx
import { useEffect, useRef, useState } from 'react';
import {
  bootstrapCameraKit,
  createMediaStreamSource,
  Transform2D,
} from '@snap/camera-kit';
import styles from './index.module.scss';
import Entry from './scenes/Entry';

export function pixelsToVW(pixels, designWidth = 1080) {
  return (pixels / designWidth) * 100 + 'vw';
}

export function pixelsToVH(pixels, designWidth = 1920) {
  return (pixels / designWidth) * 100 + 'vh';
}

const App = () => {
  const [currentState, setCurrentState] = useState(0);
  // const canvasRef = useRef(null);
  // const camKitRef = useRef(null);
  // const sessionRef = useRef(null);
  // const initialized = useRef(false);

  // useEffect(() => {
  //   const init = async () => {
  //     if (initialized.current) return; // prevent re-initialization
  //     initialized.current = true;
  //     const cameraKit = await bootstrapCameraKit({
  //       apiToken:
  //         'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQ2ODc5MzY4LCJzdWIiOiI1MzVjN2Q3Yy00NGU4LTQ4ZDQtYmUzNi0zOTk2YWFmMGJkYjR-U1RBR0lOR34xMDY3MDhkMS1kOTNkLTRiMzItYWU5My1kOTgyODU0NWFiOTgifQ.REkANrSIXu6p-NFh4C_A4qIdkNguIhvXwzqhHKmgu_w',
  //     });
  //     const liveRenderTarget = document.getElementById('canvas');
  //     const session = await cameraKit.createSession({ liveRenderTarget });
  //     const mediaStream = await navigator.mediaDevices.getUserMedia({
  //       video: {
  //         // width: { ideal: window.innerWidth * 2 },
  //         // height: { ideal: window.innerHeight * 2 },
  //         frameRate: { ideal: 30, max: 60 },
  //       },
  //       audio: false,
  //     });
  //     const source = createMediaStreamSource(mediaStream, {
  //       cameraType: 'front',
  //       fpsLimit: 60,
  //     });
  //     camKitRef.current = cameraKit;
  //     sessionRef.current = session;
  //     await session.setSource(source);
  //     await source.setRenderSize(window.innerWidth, window.innerHeight);
  //     source.setTransform(Transform2D.MirrorX);
  //     await session.play();
  //     // const lens = await camKitRef.current.lensRepository.loadLens("2beeb182-420f-4739-8298-c26dad048ea8", "18e77fd5-8185-4fca-b452-1c9378854b00");
  //     const lens = await camKitRef.current.lensRepository.loadLens(
  //       '2beeb182-420f-4739-8298-c26dad048ea8',
  //       'a5fa8a97-89ef-4488-9910-8d03f0863c91'
  //     );
  //     console.warn('camKitRef.current', camKitRef.current, lens);
  //     await sessionRef.current.applyLens(lens);
  //   };
  //   init();
  // }, []);
  return (
    <div
      className={styles.appWrapper}
      style={{
        textAlign: 'center',
        flexDirection: 'column',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* <canvas ref={canvasRef} id='canvas' /> */}
      {currentState === 0 ? <Entry /> : null}
    </div>
  );
};

export default App;
