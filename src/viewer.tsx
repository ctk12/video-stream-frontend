import axios from "axios";
import { useEffect, useState } from "react";
import Video from "./Video";
import { aStyle } from "./buttonStyle";

function Viewer() {
    const [peerData, setPeerData] = useState<any>(null);
    const [streamData, setStreamData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    console.log("streamData", streamData);

    async function init() {
        setLoading(true);
        const peer = createPeer();
        peer.addTransceiver("video", { direction: "recvonly" })
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
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
    
        return peer;
    }
    
    async function handleNegotiationNeededEvent(peer: any) {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        const payload = {
            sdp: peer.localDescription
        };
    
        const { data } = await axios.post('https://stream.tplinks.online/view', payload);
        const desc = new RTCSessionDescription(data.sdp);
        peer.setRemoteDescription(desc).catch((e:any) => console.log(e));
    }
    
    function handleTrackEvent(e: any) {
        setStreamData(e.streams[0]);
    }

  function close() {
    peerData?.close();
    setStreamData(null);
    setPeerData(null);
  }

  useEffect(() => {
    return close();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Viewer</h3>
      <div style={{ textAlign: "center" }}>{loading && (<p>Loading...</p>)}</div>
       <Video style={{ maxHeight: streamData ? "500px" : "10px" }} srcObject={streamData} autoPlay />
       
         <div style={{ textAlign: "center", margin: "10px 0" }}>
         {!loading && (
          <>
          {peerData && streamData ? (
           <button style={aStyle} onClick={close} >Stop</button>
          ):(
            <button style={aStyle} onClick={init} >View Stream</button>
          )}
          </>
         )}
         </div>
    </div>
  )
}

export default Viewer;
