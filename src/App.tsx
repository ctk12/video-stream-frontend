import Broadcast from "./Broadcast";
import { aStyle } from "./buttonStyle";
import Viewer from "./viewer";
import "./App.css";
import { useRef, useState } from "react";

function App() {
  const pathname = window.location.pathname;
  const [isRear] = useState(false);
  // const [facingMode, setFacingMode] = useState({
  //   facingMode: "user"
  // });
  // const webcamRef = useRef(null);
  // const [isCameraPresent, setIsCameraPresent] = useState(false);
  const videoElm = useRef<any>(null);
  let stream: any;
  const capture = async (facingMode: string) => {
    const options = {
      audio: false,
      video: facingMode === "environment" ? {
        facingMode: { exact: "environment" }
      } : true,
    };

    try {
      if (stream) {
        stream?.getTracks().forEach(function (track: { stop: () => void; }) {
          track.stop();
        });
      }
      stream = await navigator.mediaDevices.getUserMedia(options);
    } catch (e) {
      alert(e);
      return;
    }
    videoElm.current!.srcObject = null;
    videoElm.current!.srcObject = stream;
    videoElm.current!.play();
  }

  console.log("isRear", isRear)

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
            <Viewer isRear={isRear} />
          </div>
        ):(
          <div className="app_box">
            <div style={{ minWidth: "300px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ccc" }}>
              <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Broadcast</h3>
              <a href="/" style={aStyle}>Home</a>
            </div>
            <br />
            <Broadcast isRear={isRear} />
          </div>
        )}
    </div>

    {isRear ? (<p>Back Available</p>) : (<p>Back Not Available</p>)}

    <video ref={videoElm} controls autoPlay></video>
    <button onClick={() => capture('user')}>Front</button>
    <br/>
    <button onClick={() => capture('environment')}>Back</button>

    <p style={{ textAlign: "center" }}>Note: please stop and restart, if not works right</p>
    </>
  )
}

export default App;
