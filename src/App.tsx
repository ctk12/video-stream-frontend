import Broadcast from "./Broadcast";
import { aStyle } from "./buttonStyle";
import Viewer from "./viewer";

function App() {
  const pathname = window.location.pathname;

  return (
    <>
    {pathname === "/broadcast" && (
      <Broadcast />
    )}

    {pathname === "/viewer" && (
      <Viewer />
    )}

    {pathname !== "/broadcast" && pathname !== "/viewer" && (
     <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", marginTop: "20px" }}>
      <a href="/broadcast" style={aStyle}>Broadcast</a>
      <br />
      <a href="/viewer" style={aStyle}>Viewer</a>
    </div>
    )}

    {pathname !== "/" && (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", marginTop: "20px" }}>
      <a href="/" style={aStyle}>Home</a>
      <p>Note: please stop and restart, if not works right</p>
    </div>
    )}
    </>
  )
}

export default App;
