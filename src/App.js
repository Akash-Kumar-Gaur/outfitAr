// App.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import {
  bootstrapCameraKit,
  createMediaStreamSource,
  Transform2D,
} from "@snap/camera-kit";
import styles from "./index.module.scss";
import Entry from "./scenes/Entry";
import yts from "./assests/ytshopping.png";
import capture from "./assests/capture.png";
import youonscreen from "./assests/youonscreen.png";
import stand from "./assests/stand.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "./TripleSlider.css";

// Outfits
import top from "./assests/outfits/top.png";
import topS from "./assests/outfits/topS.png";
import bottom from "./assests/outfits/bottom.png";
import bottomS from "./assests/outfits/bottomS.png";
import none from "./assests/outfits/none.png";
// Male
import male1 from "./assests/outfits/male/male1.png";
import male2 from "./assests/outfits/male/male2.png";
import male3 from "./assests/outfits/male/male3.png";
import male4 from "./assests/outfits/male/male4.png";
import male5 from "./assests/outfits/male/male5.png";
//Female
import female1 from "./assests/outfits/female/female1.png";
import female2 from "./assests/outfits/female/female2.png";
import female3 from "./assests/outfits/female/female3.png";
import female4 from "./assests/outfits/female/female4.png";
import female5 from "./assests/outfits/female/female5.png";

export function pixelsToVW(pixels, designWidth = 1080) {
  return (pixels / designWidth) * 100 + "vw";
}

export function pixelsToVH(pixels, designWidth = 1920) {
  return (pixels / designWidth) * 100 + "vh";
}

export function convertToPixels(value, unit) {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  if (unit === "vh") {
    return (value / 100) * viewportHeight;
  } else if (unit === "vw") {
    return (value / 100) * viewportWidth;
  } else {
    console.warn("Invalid unit. Use 'vh' or 'vw'.");
  }
}

const App = () => {
  const [currentState, setCurrentState] = useState(0);
  const canvasRef = useRef(null);
  const camKitRef = useRef(null);
  const sessionRef = useRef(null);
  const initialized = useRef(false);
  const wMargin = convertToPixels(10, "vw");
  const hMargin = convertToPixels(5, "vh");
  const [gender, setGender] = useState("");
  const [selectedType, setSelectedType] = useState("top");
  const [camImg, setCamImg] = useState(null);
  const [lensId, setLensID] = useState("7b5be302-d60c-4381-9328-b3d0c317f278");
  const [applying, setApplying] = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    localStorage.removeItem("genderSelect");
  }, []);

  useEffect(() => {
    const init = async () => {
      if (initialized.current) return; // prevent re-initialization
      initialized.current = true;
      const cameraKit = await bootstrapCameraKit({
        apiToken:
          "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQ2ODc5MzY4LCJzdWIiOiI1MzVjN2Q3Yy00NGU4LTQ4ZDQtYmUzNi0zOTk2YWFmMGJkYjR-U1RBR0lOR34xMDY3MDhkMS1kOTNkLTRiMzItYWU5My1kOTgyODU0NWFiOTgifQ.REkANrSIXu6p-NFh4C_A4qIdkNguIhvXwzqhHKmgu_w",
      });
      const liveRenderTarget = document.getElementById("canvas");
      const session = await cameraKit.createSession({ liveRenderTarget });
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          frameRate: { ideal: 30, max: 60 },
        },
        audio: false,
      });
      const source = createMediaStreamSource(mediaStream, {
        cameraType: "front",
        fpsLimit: 60,
      });
      camKitRef.current = cameraKit;
      sessionRef.current = session;
      await session.setSource(source);
      await source.setRenderSize(
        window.innerWidth - wMargin,
        window.innerHeight - hMargin
      );
      source.setTransform(Transform2D.MirrorX);
      await session.play();
      // const lens = await camKitRef.current.lensRepository.loadLens("2beeb182-420f-4739-8298-c26dad048ea8", "18e77fd5-8185-4fca-b452-1c9378854b00");
    };
    if (currentState !== 0) {
      const captureButton = document.getElementById("capture-btn");
      const preview = document.getElementById("photo-preview");

      captureButton.addEventListener("click", () => {
        setCountdown(3);
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(countdownInterval);
              const canvas = document.getElementById("canvas"); // your live render target
              const imageDataUrl = canvas.toDataURL("image/png");
              preview.src = imageDataUrl; // Show captured image
              setCamImg(true);
              document.getElementById("outfitSlider").style.display = "none";
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      });
      init();
    }
  }, [currentState]);

  const lensApply = useCallback(async () => {
    await sessionRef.current.removeLens();
    const lens = await camKitRef.current.lensRepository.loadLens(
      lensId,
      "eda0b84b-0b74-49a4-be48-eb6fc49d98b1"
    );
    await sessionRef.current.applyLens(lens);
    setApplying(false);
  }, [lensId]);

  useEffect(() => {
    if (gender !== "") {
      setTimeout(() => {
        document.getElementById("infoBox")?.remove();
        document.getElementById("outfitSlider").style.display = "block";
        lensApply();
      }, 5000);
    }
  }, [gender, lensApply]);

  const MALE = [
    {
      name: "Jacket",
      icon: male1,
      lensId: "39e21f22-77f7-4719-a586-a910d9a9dfde",
      type: "top",
    },
    {
      name: "Jeans",
      icon: male5,
      lensId: "d47d8ec8-949f-4577-b21f-f7e3864bbd68",
      type: "bottom",
    },
    {
      name: "Tee",
      icon: male4,
      lensId: "7b5be302-d60c-4381-9328-b3d0c317f278",
      type: "top",
    },
    {
      name: "Tee",
      icon: male3,
      lensId: "7b5be302-d60c-4381-9328-b3d0c317f278",
      type: "top",
    },
    {
      name: "Trousers",
      icon: male2,
      lensId: "d47d8ec8-949f-4577-b21f-f7e3864bbd68",
      type: "bottom",
    },
    {
      name: "Remove",
      icon: none,
      lensId: "",
      type: "both",
    },
  ];

  const FEMALE = [
    {
      name: "Waistcoat",
      icon: female5,
      lensId: "a72db809-e4e4-4ddb-97ae-b1c3c66f5086",
      type: "top",
    },
    {
      name: "Blazer",
      icon: female1,
      lensId: "2beeb182-420f-4739-8298-c26dad048ea8",
      type: "top",
    },
    {
      name: "Jeans",
      icon: female2,
      lensId: "d47d8ec8-949f-4577-b21f-f7e3864bbd68",
      type: "bottom",
    },
    {
      name: "Trousers",
      icon: female4,
      lensId: "d47d8ec8-949f-4577-b21f-f7e3864bbd68",
      type: "bottom",
    },
    {
      name: "Coat",
      icon: female3,
      lensId: "9bc762a7-fb46-421b-83d8-ba13f78636c0",
      type: "top",
    },
    {
      name: "Remove",
      icon: none,
      lensId: "",
      type: "both",
    },
  ];

  const slides = gender === "male" ? MALE : FEMALE;

  return (
    <>
      <div
        className={styles.appWrapper}
        style={{
          textAlign: "center",
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {currentState === 0 ? (
          <Entry setCurrentState={setCurrentState} />
        ) : null}
        {currentState === 1 ? (
          <div
            className={styles.camBox}
            style={{
              width: window.innerWidth - wMargin,
              height: window.innerHeight - hMargin,
            }}
          >
            <div
              className={styles.topLeft}
              style={{
                width: pixelsToVW(290),
              }}
            >
              <img src={yts} alt="ytShopping" />
            </div>
            <img
              id="photo-preview"
              alt="camImg"
              style={{
                visibility: camImg ? "visible" : "hidden",
                width: camImg ? "auto" : 0,
                height: camImg ? "auto" : 0,
              }}
            />
            {camImg ? null : <canvas ref={canvasRef} id="canvas" />}
            <div
              className={styles.center}
              id="infoBox"
              style={{
                width: pixelsToVW(566),
              }}
            >
              <img src={gender !== "" ? stand : youonscreen} alt="ytShopping" />
            </div>
            <div
              id="genselect"
              className={styles.bottom}
              style={{
                height: pixelsToVH(244.9638671875),
                width: pixelsToVW(608.64453125),
                borderRadius: pixelsToVH(20),
                fontSize: pixelsToVH(42),
              }}
            >
              Select a gender
              <div className={styles.genSelect}>
                <button
                  onClick={() => {
                    setGender("male");
                    setLensID(MALE[0].lensId);
                    localStorage.setItem("genderSelect", "male");
                    setTimeout(() => {
                      document.getElementById("genselect")?.remove();
                    }, 0);
                  }}
                  style={{
                    borderRadius: pixelsToVH(51),
                    width: pixelsToVW(245),
                    height: pixelsToVH(76),
                    fontSize: pixelsToVH(31.4),
                    background: gender === "male" ? "#FD0100" : "#fff",
                    color: gender !== "male" ? "#FD0100" : "#fff",
                  }}
                >
                  Male
                </button>
                <button
                  onClick={() => {
                    setGender("female");
                    setLensID(FEMALE[0].lensId);
                    localStorage.setItem("genderSelect", "female");
                    setTimeout(() => {
                      document.getElementById("genselect")?.remove();
                    }, 0);
                  }}
                  style={{
                    borderRadius: pixelsToVH(51),
                    width: pixelsToVW(245),
                    height: pixelsToVH(76),
                    fontSize: pixelsToVH(31.4),
                    background: gender === "female" ? "#FD0100" : "#fff",
                    color: gender !== "female" ? "#FD0100" : "#fff",
                  }}
                >
                  Female
                </button>
              </div>
            </div>
            {countdown > 0 ? (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: pixelsToVH(200),
                  color: "#fff",
                }}
              >
                {countdown}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className={styles.sliderContainer} id="outfitSlider">
        <div
          id="capture-btn"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translate(-50%, 0)",
            width: pixelsToVW(145),
          }}
        >
          {applying ? "Applying Lens" : <img src={capture} alt="capture" />}
        </div>
        <div className="slider-wrapper">
          <Swiper
            modules={[EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            loop={false}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 120,
              modifier: 2,
              slideShadows: false,
            }}
            className="triple-swiper"
          >
            {slides.map((slide, index) => {
              if (slide.type !== selectedType && slide.type !== "both")
                return null;
              return (
                <SwiperSlide
                  key={index}
                  className="triple-slide"
                  style={{
                    height: pixelsToVH(250),
                    width: pixelsToVH(200),
                  }}
                >
                  <div
                    className="slider-card"
                    onClick={async () => {
                      // alert("clicked");
                      setLensID(slide?.lensId);
                      setApplying(true);
                      lensApply();
                    }}
                  >
                    <div className="slider-card-img">
                      <img src={slide.icon} alt={slide.title} />
                    </div>
                    <div>{slide.name}</div>
                  </div>
                </SwiperSlide>
              );
            })}
            <div
              className="type-select"
              style={{
                transform: `translateX(${
                  selectedType === "top" ? "10vw" : "-8vw"
                })`,
              }}
            >
              <div
                className="type-select-card"
                style={{
                  width: pixelsToVW(131),
                  height: "auto",
                }}
                onClick={() => setSelectedType("top")}
              >
                <img src={selectedType === "top" ? topS : top} alt="top" />
              </div>
              <div
                className="type-select-card"
                style={{
                  width: pixelsToVW(131),
                  height: "auto",
                }}
                onClick={() => setSelectedType("bottom")}
              >
                <img
                  src={selectedType !== "top" ? bottomS : bottom}
                  alt="bottom"
                />
              </div>
            </div>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default App;
