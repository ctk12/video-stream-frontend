import Broadcast from "./Broadcast";
import { aStyle } from "./buttonStyle";
import Viewer from "./viewer";
import "./App.css";
import { useEffect, useRef, useState } from "react";

function App() {
  const pathname = window.location.pathname;
  const [isRear, setIsRear] = useState<boolean>(false);
  const [isDevices, setIsDevices] = useState<any>([]);
  const videoElm = useRef<any>(null);

  navigator.mediaDevices.enumerateDevices().then(function(devices) {
    for (let i = 0; i < devices.length; i++) {
      if (devices[i].kind === "videoinput" && devices[i].label === "environment") {
        // The rear camera is available.
        setIsRear(true);
      }
    }
  });



  function runOne() {
    navigator.mediaDevices.enumerateDevices().then(function(devices) {
      const arr: any = [];
      for (let i = 0; i < devices.length; i++) {
        arr.push(devices[i].label);
        if (devices[i].label.includes("facing back")) {
          setIsRear(true);
        }
        console.log(devices[i].label);
      }
      setIsDevices(arr);
    });
  }

  
  // const getCameraSelection = async () => {
  //   const devices = await navigator.mediaDevices.enumerateDevices();
  //   const videoDevices = devices.filter(device => device.kind === 'videoinput');
  //   const options = videoDevices.map(videoDevice => {
  //     return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  //   });
  //   // cameraOptions.innerHTML = options.join('');
  //   return options;
  // };

  // console.log("cams", getCameraSelection());

  useEffect(() => {
    runOne();
  }, []);

  const capture = async (facingMode: string) => {
    const options = {
      audio: false,
      video: facingMode === "environment" ? {
        facingMode: { exact: "environment" }
      } : true,
    };

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(options);
    } catch (e) {
      alert(e);
      return;
    }
    videoElm.current!.srcObject = null;
    videoElm.current!.srcObject = stream;
    videoElm.current!.play();
  }

  return (
    <>
    <div className="app" style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", marginTop: "20px" }}>
        {pathname !== "/broadcast" ? (
          <div className="app_box">
            <div style={{ minWidth: "300px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ccc" }}>
              <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Home</h3>
              <a href="/broadcast" style={aStyle}>Broadcast</a>
            </div>
            <br />
            <Viewer />
          </div>
        ):(
          <div className="app_box">
            <div style={{ minWidth: "300px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ccc" }}>
              <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Broadcast</h3>
              <a href="/" style={aStyle}>Home</a>
            </div>
            <br />
            <Broadcast />
          </div>
        )}
    </div>

    <video ref={videoElm} controls autoPlay></video>
    <button onClick={() => capture('user')}>Front</button>
    <br/>
    <button onClick={() => capture('environment')}>Back</button>

    {isRear && <p>Back available</p>}

    {isDevices.map((item: any) => (
      <p>{item}</p>
    ))}

    <p style={{ textAlign: "center" }}>Note: please stop and restart, if not works right</p>
    </>
  )
}

export default App;
