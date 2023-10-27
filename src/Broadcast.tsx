import axios from "axios";
import Video from "./Video";
import { useEffect, useState } from "react";
import { aStyle } from "./buttonStyle";

function Broadcast() {
    const [value, setValue] = useState<string>("");
    const [peerData, setPeerData] = useState<any>(null);
    const [streamData, setStreamData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState("");

    async function init() {
        if (!value) {
          alert("please enter username");
          return;
        }
        const userNameAvailable = await validate(value);
        if (userNameAvailable) {
          setLoading(true);
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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
        const { data } = await axios.post('http://localhost:5000/broadcast', payload);
        const desc = new RTCSessionDescription(data.sdp);
        peer.setRemoteDescription(desc).catch((e: any) => console.log(e));
    }

    async function validate(data: string) {
      const result = await axios.post('http://localhost:5000/validate', { username: data });
      console.log(result.data);
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
      axios.post('http://localhost:5000/close', { username: state });
      return "";
    });
  }

  useEffect(() => {
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      void close();
      event.returnValue = '';
    });

    return () => {
      window.removeEventListener('beforeunload', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      void close();
      event.returnValue = '';
    });
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
       <div style={{ textAlign: "center" }}>{loading && (<p>Loading...</p>)}</div>
       {peerData && streamData && <p>Username: {value}</p>}
       <Video style={{ maxHeight: streamData ? "500px" : "10px" }} srcObject={streamData} autoPlay muted />
      
         <div style={{ textAlign: "center", margin: "10px 0" }}>
         {!loading && (
          <>
          {peerData && streamData ? (
            <button style={aStyle} onClick={close} >Stop Stream</button>
          ):(
            <>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px" }}>
            <p style={{ alignSelf: "flex-start" }}>Username</p>
            <input style={{ margin: "0 10px 0 0", padding: "10px" }} placeholder="enter username" type="text" onChange={(e) => setValue(e.target.value)} />
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
