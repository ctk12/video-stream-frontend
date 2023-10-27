import Broadcast from "./Broadcast";
import { aStyle } from "./buttonStyle";
import Viewer from "./viewer";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const pathname = window.location.pathname;
  const [isRear, setIsRear] = useState<boolean>(false);

  async function runOne() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
        // ? { facingMode: { exact: "environment" } }
        // : true,
      audio: true
    });
    stream.getVideoTracks().forEach(track => {
      const caps = track.getCapabilities();
      if (caps.facingMode?.includes("environment")) {
        setIsRear(true);
      }
    });
  }

  useEffect(() => {
    runOne();
  }, []);

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

    {isRear && <p>Back Camera available</p>}


    <p style={{ textAlign: "center" }}>Note: please stop and restart, if not works right</p>
    </>
  )
}

export default App;
