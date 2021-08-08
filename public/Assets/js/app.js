// const myApp = () => {
//   const init = (uid, mid) => {
//     alert("From App Js");
//   };

//   return {
//     _init: (uid, mid) => {
//       init(uid, mid);
//     },
//   };
// };

const myApp = (function () {
  let socket = null;
  function init(uid, mid) {
    event_process_signaling_server();
  }
  const event_process_signaling_server = () => {
    socket = io.connect();
    socket.on("connect", () => {
      alert("From Connected");
    });
  };
  return {
    _init: function (uid, mid) {
      init(uid, mid);
    },
  };
})();
