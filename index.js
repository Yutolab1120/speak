let localStream;
      
// カメラ映像取得
navigator.mediaDevices.getUserMedia({audio: true})
  .then( stream => {
  // 成功時にvideo要素にカメラ映像をセットし、再生
  const audioElm = document.getElementById('my-video');
  audioElm.srcObject = stream;
  audioElm.play();
  // 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
  localStream = stream;
}).catch( error => {
  // 失敗時にはエラーログを出力
  console.error('mediaDevice.getUserMedia() error:', error);
  return;
});

const peer = new Peer({
    key: '320e8f26-3e2a-4804-b922-e59bd58b7d37',
    debug: 3
});

peer.on('open', () => {
    document.getElementById('my-id').textContent = peer.id;
});

document.getElementById('make-call').onclick = () => {
    const theirID = document.getElementById('their-id').value;
    const mediaConnection = peer.call(theirID, localStream);
    setEventListener(mediaConnection);
};

// イベントリスナを設置する関数
const setEventListener = mediaConnection => {
mediaConnection.on('stream', stream => {
    // video要素にカメラ映像をセットして再生
    const audioElm = document.getElementById('their-video')
    audioElm.srcObject = stream;
    audioElm.play();
});
}

peer.on('call', mediaConnection => {
    mediaConnection.answer(localStream);
    setEventListener(mediaConnection);
});