// App.jsx
import { useEffect, useRef, useState } from 'react';
import {
  bootstrapCameraKit,
  createMediaStreamSource,
  Transform2D,
} from '@snap/camera-kit';
import styles from './index.module.scss';
import Entry from './scenes/Entry';
import yts from './assests/ytshopping.png';
import youonscreen from './assests/youonscreen.png';
import stand from './assests/stand.png';

export function pixelsToVW(pixels, designWidth = 1080) {
  return (pixels / designWidth) * 100 + 'vw';
}

export function pixelsToVH(pixels, designWidth = 1920) {
  return (pixels / designWidth) * 100 + 'vh';
}

export function convertToPixels(value, unit) {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  if (unit === 'vh') {
    return (value / 100) * viewportHeight;
  } else if (unit === 'vw') {
    return (value / 100) * viewportWidth;
  } else {
    console.warn("Invalid unit. Use 'vh' or 'vw'.");
  }
}

const App = () => {
  const [currentState, setCurrentState] = useState(1);
  const canvasRef = useRef(null);
  const camKitRef = useRef(null);
  const sessionRef = useRef(null);
  const initialized = useRef(false);
  const wMargin = convertToPixels(10, 'vw');
  const hMargin = convertToPixels(5, 'vh');
  const [gender, setGender] = useState('');

  useEffect(() => {
    localStorage.removeItem('genderSelect')
  }, [])

  useEffect(() => {
    const init = async () => {
      if (initialized.current) return; // prevent re-initialization
      initialized.current = true;
      const cameraKit = await bootstrapCameraKit({
        apiToken:
          'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQ2ODc5MzY4LCJzdWIiOiI1MzVjN2Q3Yy00NGU4LTQ4ZDQtYmUzNi0zOTk2YWFmMGJkYjR-U1RBR0lOR34xMDY3MDhkMS1kOTNkLTRiMzItYWU5My1kOTgyODU0NWFiOTgifQ.REkANrSIXu6p-NFh4C_A4qIdkNguIhvXwzqhHKmgu_w',
      });
      const liveRenderTarget = document.getElementById('canvas');
      const session = await cameraKit.createSession({ liveRenderTarget });
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          // width: { ideal: window.innerWidth * 2 },
          // height: { ideal: window.innerHeight * 2 },
          frameRate: { ideal: 30, max: 60 },
        },
        audio: false,
      });
      const source = createMediaStreamSource(mediaStream, {
        cameraType: 'front',
        fpsLimit: 60,
      });
      camKitRef.current = cameraKit;
      sessionRef.current = session;
      await session.setSource(source);
      await source.setRenderSize(window.innerWidth - wMargin, window.innerHeight - hMargin);
      source.setTransform(Transform2D.MirrorX);
      await session.play();
      // const lens = await camKitRef.current.lensRepository.loadLens("2beeb182-420f-4739-8298-c26dad048ea8", "18e77fd5-8185-4fca-b452-1c9378854b00");

    };
    if (currentState !== 0) {
      init();
    }
  }, [currentState]);


  useEffect(() => {
    const lensApply = async () => {
      const lens = await camKitRef.current.lensRepository.loadLens(
        '2beeb182-420f-4739-8298-c26dad048ea8',
        'a5fa8a97-89ef-4488-9910-8d03f0863c91'
      );
      await sessionRef.current.applyLens(lens);
    }
    if(gender !== ''){
      setTimeout(() => {
        document.getElementById('infoBox')?.remove()
        lensApply();
      }, 5000);
    }
  }, [gender])

  return (
    <div
      className={styles.appWrapper}
      style={{
        textAlign: 'center',
        flexDirection: 'column',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {currentState === 0 ? <Entry setCurrentState={setCurrentState} /> : null}
      {currentState === 1 ? <div className={styles.camBox} style={{
        width: window.innerWidth - wMargin,
        height: window.innerHeight - hMargin
      }}>
        <div className={styles.topLeft} style={{
          width: pixelsToVW(290)
        }}>
          <img src={yts} alt='ytShopping' />
        </div>
        <canvas ref={canvasRef} id='canvas' />
        <div className={styles.center} id="infoBox" style={{
          width: pixelsToVW(566)
        }}>
          <img src={gender !== '' ? stand : youonscreen} alt='ytShopping' />
        </div>
        <div id='genselect' className={styles.bottom} style={{
          height: pixelsToVH(244.9638671875),
          width: pixelsToVW(608.64453125),
          borderRadius: pixelsToVH(20),
          fontSize: pixelsToVH(42)
        }}>
          Select a gender
          <div className={styles.genSelect}>
            <button onClick={() => {
              setGender('male');
              localStorage.setItem('genderSelect', 'male');
              setTimeout(() => {
                document.getElementById('genselect')?.remove()
              }, 0);
            }} style={{
              borderRadius: pixelsToVH(51),
              width: pixelsToVW(245),
              height: pixelsToVH(76),
              fontSize: pixelsToVH(31.4),
              background: gender === 'male' ? '#FD0100' : '#fff',
              color: gender !== 'male' ? '#FD0100' : '#fff'
            }}>Male</button>
            <button onClick={() => {
              setGender('female'); localStorage.setItem('genderSelect', 'female'); setTimeout(() => {
                document.getElementById('genselect')?.remove()
              }, 0);
            }} style={{
              borderRadius: pixelsToVH(51),
              width: pixelsToVW(245),
              height: pixelsToVH(76),
              fontSize: pixelsToVH(31.4),
              background: gender === 'female' ? '#FD0100' : '#fff',
              color: gender !== 'female' ? '#FD0100' : '#fff'
            }}>Female</button>
          </div>
        </div>
      </div> : null}
    </div>
  );
};

export default App;
