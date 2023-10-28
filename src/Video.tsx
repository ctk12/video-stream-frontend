import { VideoHTMLAttributes, useEffect, useRef, useState } from 'react'

type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream,
  peerData: RTCPeerConnection
}

export default function Video({ srcObject, peerData, ...props }: PropsType) {
  const refVideo = useRef<HTMLVideoElement>(null)
  const [switchCam, setSwitchCam] = useState(true);
  // const connections = [peerData];
  // let stream: any = srcObject;

  function setCamera(facingMode: string) {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: facingMode === "environment" ? {
          facingMode: { exact: "environment" }
        } : true,
      })
      .then((stream) => {
        const tracks = stream.getTracks()
        peerData.getSenders()
          .forEach(sender => {
            const newTrack = tracks.find(track => track?.kind === sender?.track?.kind);
            if (newTrack) {
              sender?.replaceTrack(newTrack);
            }
          })
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
    <button onClick={() => setSwitchCam(!switchCam)}>switch Cam</button>
    <br/>
    {/* <button onClick={() => setSwitchCam(!switchCam)}>Back</button> */}
  </>
  );
}