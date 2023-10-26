import axios from "axios";
import Video from "./Video";
import { useEffect, useState } from "react";
import { aStyle } from "./buttonStyle";

function Broadcast() {
    const [peerData, setPeerData] = useState<any>(null);
    const [streamData, setStreamData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function init() {
        setLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStreamData(stream);
        const peer = createPeer();
        stream.getTracks().forEach(track => peer.addTrack(track, stream));
        setPeerData(peer);
        setLoading(false);
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
        };
    
        const { data } = await axios.post('https://stream.tplinks.online/broadcast', payload);
        const desc = new RTCSessionDescription(data.sdp);
        peer.setRemoteDescription(desc).catch((e: any) => console.log(e));
    }

  function close() {
    peerData?.close();
    streamData?.getTracks().forEach(function (track: { stop: () => void; }) {
        track.stop();
    });
    setStreamData(null);
    setPeerData(null);
  }

  useEffect(() => {
    return close();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Video Broadcast</h3>
       <div style={{ textAlign: "center" }}>{loading && (<p>Loading...</p>)}</div>
       <Video style={{ maxHeight: streamData ? "500px" : "10px" }} srcObject={streamData} autoPlay muted />
      
         <div style={{ textAlign: "center", margin: "10px 0" }}>
         {!loading && (
          <>
          {peerData && streamData ? (
            <button style={aStyle} onClick={close} >Stop Stream</button>
          ):(
            <button style={aStyle} onClick={init} >Start Stream</button>
          )}
          </>
         )}
         </div>
    </div>
  )
}

export default Broadcast;
