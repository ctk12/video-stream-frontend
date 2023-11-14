import axios from "axios";
import { useEffect, useState } from "react";
import Video from "./Video";
import { aStyle } from "./buttonStyle";
import { socket } from "./socket";

function Viewer() {
    const [peerData, setPeerData] = useState<any>(null);
    const [streamData, setStreamData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [streams, setStreams] = useState<string[]>([]);
    const [activeStream, setActiveStream] = useState<string>("");
    const [ipAddress, setIPAddress] = useState('');

    async function init(username: string) {
        close();
        setLoading(true);
        const peer = createPeer(username);
        peer.addTransceiver("video", { direction: "recvonly" });
        peer.addTransceiver('audio', { direction: 'recvonly' });
        setPeerData(peer);
        setLoading(false);
        setActiveStream(() => {
          socket.emit("WATCHING", username, "add", ipAddress);
          return username;
        });
    }
    
    function createPeer(username: string) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                  },
            ]
        });
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer, username);
    
        return peer;
    }
    
    async function handleNegotiationNeededEvent(peer: any, username: string) {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        const payload = {
            sdp: peer.localDescription,
            username
        };
    
        const { data } = await axios.post('https://stream.tplinks.online/view', payload);
        const desc = new RTCSessionDescription(data.sdp);
        peer.setRemoteDescription(desc).catch((e:any) => console.log("descError", e));
    }
    
    function handleTrackEvent(e: any) {
        setStreamData(e.streams[0]);
    }

  function close() {
    peerData?.close();
    setStreamData(null);
    setPeerData(null);
    setActiveStream((state: string) => {
      socket.emit("WATCHING", state, "remove", ipAddress);
      return "";
    });
  }

  async function checkStreams() {
    const res = await axios.get("https://stream.tplinks.online/all");
    setStreams(res.data.data);
  }

  async function getIp() {
    const res = await axios.get("https://php-get-ip.vercel.app");
    setIPAddress(res.data);
  }

  useEffect(() => {
    checkStreams();
    getIp();
    socket.on('USER_REMOVED_USERNAME', (data) => {
      setActiveStream(state => {
        if (state === data) {
          close();
          return "";
        }
        return state;
      });
      setStreams((state: any) => state.filter((item: string) => item !== data));
    });

    socket.on('USER_ADDED_USERNAME', (data) => {
      setStreams((state: any) => [...state, data]);
    });

    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      void close();
      event.returnValue = '';
    });

    return () => {
      socket.off('USER_REMOVED_USERNAME', (data) => {
        setStreams((state: any) => state.filter((item: string) => item !== data));
      });

      socket.off('USER_ADDED_USERNAME', (data) => {
        setStreams((state: any) => [...state, data]);
      });

      window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        void close();
        event.returnValue = '';
      });
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>

      <div style={{ textAlign: "center" }}>
        { streams.length > 0 ? (<h3>available live streams</h3>) : (<h3>No streams available</h3>)}
      </div>
      <div style={{ textAlign: "center", width: "100%" }}>
      <div style={{display: "flex", gap: "20px", padding: "10px", width: "90%", overflowX: "scroll", marginBottom: "20px"}}>
        {streams.map((item: string) => (
          <div key={item} onClick={() => init(item)} style={{ textAlign: "center", cursor: "pointer" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 42 , height: 42}}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p style={{ margin: "2px 0" }}>{item}</p>
          </div>
        ))}
      </div>
      </div>

      <div style={{ textAlign: "center" }}>{loading && (<p>Loading...</p>)}</div>
       {peerData && streamData && <p>Username: {activeStream}</p>}
       <Video style={{ maxHeight: streamData ? "500px" : "10px" }} srcObject={streamData} autoPlay controls={streamData ? true : false}/>
    
         <div style={{ textAlign: "center", margin: "10px 0" }}>
         {!loading && (
          <>
          {peerData && streamData && (
           <button style={aStyle} onClick={close} >Stop</button>
          )}
          </>
         )}
         </div>
    </div>
  )
}

export default Viewer;
