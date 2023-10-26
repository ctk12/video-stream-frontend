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
    </>
  )
}

export default App;
