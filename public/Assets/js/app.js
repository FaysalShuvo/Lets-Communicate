const appProcces = function () {
  let iceConfiguration = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
      {
        urls: "stun:stun1.l.google.com:19302",
      },
    ],
  };
  function setConnection(connid) {
    let = connection = new RTCPeerConnection(iceConfiguration);
  }

  return {
    setNewConnection: async function (connid) {
      await setConnection(connid);
    },
  };
};
const myApp = (function () {
  let socket = null;
  let user_id = "";
  let meeting_id = "";
  function init(uid, mid) {
    user_id: uid;
    meeting_id: mid;
    event_process_signaling_server();
  }
  const event_process_signaling_server = () => {
    socket = io.connect();
    socket.on("connect", () => {
      if (socket.connected) {
        if (user_id != "" && meeting_id != "") {
          console.log("ob");
          socket.emit("userconnect", {
            displayName: user_id,
            meetingId: meeting_id,
          });
        }
      }
    });

    socket.on("inform_others_about_me", (data) => {
      addUser(data.other_user_id, data.connId);
      appProcces.setNewConnection(data.connId);
    });
  };

  function addUser(other_user_id, connId) {
    let newDivid = $("#otherTemplate").clone();
    newDivid = newDivid.attr("id", connId).addClass("other");
    newDivid.find("h2").text(other_user_id);
    newDivid.find("video").attr("id", "v_" + connId);
    newDivid.find("audio").attr("id", "a_" + connId);
    newDivid.show();

    $("#divUsers").append(newDivId);
  }
  return {
    _init: function (uid, mid) {
      init(uid, mid);
    },
  };
})();
