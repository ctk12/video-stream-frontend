import { VideoHTMLAttributes, useEffect, useRef, useState } from 'react'

type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream,
  peerData: RTCPeerConnection,
  view: boolean,
  isRear: boolean
}

export default function Video({ srcObject, peerData, view, isRear, ...props }: PropsType) {
  const refVideo = useRef<HTMLVideoElement>(null)
  const [switchCam, setSwitchCam] = useState(true);
  const [cam, setCam] = useState(true);
  const [mic, setMic] = useState(true);
  const connections = [peerData];
  let stream: any = srcObject;

  function hideCam() {
    // setStreamData((state: any) => {
      srcObject?.getTracks().forEach((track: any) => {
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
      // return state;
    // });
  }

  function switchMic() {
    srcObject?.getTracks().forEach((track: any) => {
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
  }

  const capture = async (facingMode: string) => {
    const options = {
      audio: false,
      video: facingMode === "environment" ? {
        facingMode: { exact: "environment" }
      } : true,
    };

    try {
      if (stream) {
        stream?.getTracks().forEach(function (track: { stop: () => void; }) {
          track.stop();
        });
      }
      stream = await navigator.mediaDevices.getUserMedia(options);
    } catch (e) {
      alert(e);
      return;
    }
    refVideo.current!.srcObject = null;
    refVideo.current!.srcObject = stream;
    refVideo.current!.play();
  }

  function setCamera(selectedCamera: string) {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          deviceId: {
            exact: selectedCamera,
          },
        },
      })
      .then((stream) => {
        const [videoTrack] = stream.getVideoTracks();
        connections.forEach((pc) => {
          const sender = pc
            .getSenders()
            .find((s) => s?.track?.kind === videoTrack.kind);
          console.log("Found sender:", sender);
          sender?.replaceTrack(videoTrack);
        });
      })
      .catch((err) => {
        console.error(`Error happened: ${err}`);
      });
  }

  useEffect(() => {
    setCamera(switchCam ? "user" : "environment");
  }, [switchCam]);

  useEffect(() => {
    if (!refVideo.current) return
    refVideo.current.srcObject = srcObject
  }, [srcObject])

  return (
  <>
    <video ref={refVideo} {...props} />
    <br />
    <button onClick={() => capture('user')}>Front</button>
    <br/>
    <button onClick={() => capture('environment')}>Back</button>
    {!view && srcObject && (
      <>
      {isRear && <img src="/flip-camera.svg" onClick={() => setSwitchCam(!cam)} style={{ cursor: "pointer" }} width={42} height={42} alt="" />}
      {/* <button onClick={switchMic}>Mic</button> */}
      <br />
      <button onClick={hideCam}>{cam ? "Hide Cam" : "Show Cam"}</button>
      <br />
      <button onClick={switchMic}>{mic ? "Off Mic" : "On Mic"}</button>
      </>
    )}
  </>
  );
}