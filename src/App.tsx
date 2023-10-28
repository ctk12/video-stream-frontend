import Broadcast from "./Broadcast";
import { aStyle } from "./buttonStyle";
import Viewer from "./viewer";
import "./App.css";
import { useState } from "react";
import Webcam from "react-webcam";

function App() {
  const pathname = window.location.pathname;
  const [isRear, setIsRear] = useState(false);
  const [facingMode, setFacingMode] = useState({
    facingMode: "user"
  });
  // const webcamRef = useRef(null);
  // const [isCameraPresent, setIsCameraPresent] = useState(false);

  console.log("isRear", isRear)

  function handleSwitchCamera() {
    setFacingMode((prevFacingMode: any) => {
      if (prevFacingMode.video === true) {
        return {
          facingMode: "environment"
        };
      } else {
        return {
          facingMode: "user"
        }
      }

      return prevFacingMode;
    });
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

    <Webcam videoConstraints={facingMode} />
    <button onClick={handleSwitchCamera}>Switch Camera</button>

    <p style={{ textAlign: "center" }}>Note: please stop and restart, if not works right</p>
    </>
  )
}

export default App;
