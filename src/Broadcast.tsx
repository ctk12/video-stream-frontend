import axios from "axios";
import Video from "./Video";
import { useEffect, useState } from "react";
import { aStyle } from "./buttonStyle";
import { BASE_URL, socket } from "./socket";

function Broadcast() {
    const [value, setValue] = useState<string>("");
    const [peerData, setPeerData] = useState<any>(null);
    const [streamData, setStreamData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState("");
    const [watching, setWatching] = useState<any>({});
    const [cam, setCam] = useState(true);
    const [mic, setMic] = useState(true);

    async function init() {
        if (!value) {
          alert("please enter username");
          return;
        }
        const userNameAvailable = await validate(value);
        if (userNameAvailable) {
          setLoading(true);
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
              // ? { facingMode: { exact: "environment" } }
              // : true,
            audio: true
          });
          setStreamData(stream);
          const peer = createPeer();
          stream.getTracks().forEach(track => peer.addTrack(track, stream));
          setPeerData(peer);
          setLoading(false);
          setError("");
        } else {
          setError("Username not available, Already exits");
        }
    }
    
    
    function createPeer() {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                  },
            ]
        });
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
    
        return peer;
    }
    
    async function handleNegotiationNeededEvent(peer: any) {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        const payload = {
            sdp: peer.localDescription,
            username: value
        };
        const { data } = await axios.post(`${BASE_URL}/broadcast`, payload);
        const desc = new RTCSessionDescription(data.sdp);
        peer.setRemoteDescription(desc).catch((e: any) => console.log("descError", e));
    }

    async function validate(data: string) {
      const result = await axios.post(`${BASE_URL}/validate`, { username: data });
      return result.data.msg;
    }

  async function close() {
    setStreamData((state: any) => {
      state?.getTracks().forEach(function (track: { stop: () => void; }) {
        track.stop();
      });
      return null;
    });
    setPeerData((state: any) => {
      state?.close();
      return null;
    });
    setValue((state: string) => {
      axios.post(`${BASE_URL}/close`, { username: state });
      return "";
    });
    setWatching({});
  }

  function switchMic() {
    setStreamData((state: any) => {
      state?.getTracks().forEach((track: any) => {
        if (track.kind === "audio") {
          if (track.enabled) {
            track.enabled = false;
            setMic(false);
          } else {
            track.enabled = true;
            setMic(true);
          }
        }
      });
      return state;
    });
  }

  function hideCam() {
    setStreamData((state: any) => {
      state?.getTracks().forEach((track: any) => {
        if (track.kind === "video") {
          if (track.enabled) {
            track.enabled = false;
            setCam(false);
          } else {
            track.enabled = true;
            setCam(true);
          }
        }
      });
      return state;
    });
  }

  function handleSocket1(data: string, type: string, ip: string) {
    setValue(state => {
      if (data === state && ip !== "") {
        if (type === "add") {
          setWatching((state: any) => {
            const stateCopy = {...state};
            if (stateCopy[ip]) {
              stateCopy[ip] += 1;
            } else {
              stateCopy[ip] = 1;
            }
            return stateCopy;
          });
        } else {
          setWatching((state: any) => {
            const stateCopy = {...state};
            stateCopy[ip] -= 1;
            const newObj: any = {};
            Object.keys(stateCopy).filter(item => stateCopy[item] !== 0).map(item => {
              newObj[item] = stateCopy[item];
            })
            return newObj;
          });
        }
      }

      return state;
    });
  }

  useEffect(() => {
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      void close();
      event.returnValue = '';
    });

    socket.on('WATCHING_UPDATE', handleSocket1);

    return () => {
      window.removeEventListener('beforeunload', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      void close();
      event.returnValue = '';
    });

    socket.off('WATCHING_UPDATE', handleSocket1);
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
       <div style={{ textAlign: "center" }}>{loading && (<p>Loading...</p>)}</div>
       {peerData && streamData && <p>Username: {value}</p>}
       {peerData && streamData && <p>watching {Object.keys(watching).length}</p>}
       <Video style={{ maxHeight: streamData ? "500px" : "10px" }} srcObject={streamData} autoPlay muted />
       {peerData && streamData && (
        <>
        <br />
        <button onClick={hideCam}>{cam ? "Hide Cam" : "Show Cam"}</button>
        <br />
        <button onClick={switchMic}>{mic ? "Off Mic" : "On Mic"}</button>
        </>
       )}

         <div style={{ textAlign: "center", margin: "10px 0" }}>
         {!loading && (
          <>
          {peerData && streamData ? (
            <button style={aStyle} onClick={close} >Stop Stream</button>
          ):(
            <>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px" }}>
            <p style={{ alignSelf: "flex-start" }}>Username</p>
            <input style={{ margin: "0", padding: "10px" }} placeholder="enter username" type="text" onChange={(e) => setValue(e.target.value)} />
            <button style={aStyle} onClick={init} >Start Stream</button>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            </>
          )}
          </>
         )}
         </div>
    </div>
  )
}

export default Broadcast;
