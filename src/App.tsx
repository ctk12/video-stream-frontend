import Broadcast from "./Broadcast";
import { aStyle } from "./buttonStyle";
import Viewer from "./viewer";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const pathname = window.location.pathname;
  const [isRear, setIsRear] = useState(false);

  console.log("isRear", isRear)

  async function hasRearCamera(): Promise<void> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const rearCamera = devices.find((device: any) => device.kind === "video" && device.facingMode === "environment");
    if (rearCamera) {
      // The device has a rear camera.
      setIsRear(true);
    } else {
      // setIsRear(false);
      // The device does not have a rear camera.
    }
    // let stream: any = null;
    // stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}}).then(devices => {
    //   const isRearData = [devices].some((device: any) => device.kind === "videoinput" && device.facingMode === "environment");
    //   setIsRear(isRearData);
    //   // console.log("in rear", isRearData);
    // });
    // stream?.getTracks().forEach(function (track: { stop: () => void; }) {
    //   track.stop();
    // });
    // stream = null;
  }

  useEffect(() => {
    hasRearCamera();
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

    <p style={{ textAlign: "center" }}>Note: please stop and restart, if not works right</p>
    </>
  )
}

export default App;
