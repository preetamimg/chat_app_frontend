// client/src/AudioCall.js
import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../service/socket';


const AudioCall = ({ userId, peerId }) => {
  const localStreamRef = useRef();
  const peerConnectionRef = useRef();
  const [callIncoming, setCallIncoming] = useState(false);

  useEffect(() => {
    socket.on('incomingCall', ({ from }) => {
      console.log("frommmmmmmmmmmmmmmmmmmmmmm", from)
      setCallIncoming(true);
    });

    socket.on('offer', async ({ offer, from }) => {
      peerConnectionRef.current = createPeerConnection(from);
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => peerConnectionRef.current.addTrack(track, stream));
      localStreamRef.current.srcObject = stream;
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit('answer', { to: from, answer });
    });

    socket.on('answer', async ({ answer }) => {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('iceCandidate', async ({ candidate }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
  }, []);

  const createPeerConnection = (to) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });

    pc.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('iceCandidate', { to, candidate: event.candidate });
      }
    };

    pc.ontrack = event => {
      const remoteAudio = document.getElementById('remoteAudio');
      if (remoteAudio) remoteAudio.srcObject = event.streams[0];
    };

    return pc;
  };

  const startCall = async () => {
    socket.emit('startCall', { to: peerId, from: userId });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    peerConnectionRef.current = createPeerConnection(peerId);
    stream.getTracks().forEach(track => peerConnectionRef.current.addTrack(track, stream));
    localStreamRef.current.srcObject = stream;
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    socket.emit('offer', { to: peerId, offer });
  };

  return (
    <div>
      <h3>Audio Call</h3>
      <button onClick={startCall}>Start Call</button>
      {callIncoming && <p>Incoming call...</p>}
      <audio ref={localStreamRef} autoPlay muted></audio>
      <audio id="remoteAudio" autoPlay></audio>
    </div>
  );
};

export default AudioCall;
