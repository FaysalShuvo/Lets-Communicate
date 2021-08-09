const appProcces = function () {
  let peers_connection_ids = [];
  let peers_connection = [];
  let serverProcess;
  function _init(SDP_function, my_connid) {
    serverProcess = SDP_function;
    my_connection_id = my_connid;
  }
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
    let connection = new RTCPeerConnection(iceConfiguration);

    connection.onnegotiationneeded = async function (event) {
      await setOffer(connid);
    };

    connection.onicecandidate = function (event) {
      if (event.can) {
        serverProcess(
          JSON.stringify({ icecandidate: event.candidate }),
          connid
        );
      }
    };
    connection.ontrack = function (event) {};

    peers_connection_ids[connid] = connid;
    peers_connection[connid] = connection;
  }
  function setOffer(connid) {
    let connection = peers_connection[connid];
    let offer = await connection.createOffer();

    await connection.setLocalDescription(offer);
    serverProcess(
      JSON.stringify({
        offer: connection.LocalDescription,
      }),
      connid
    );
  }
  return {
    setNewConnection: async function (connid) {
      await setConnection(connid);
    },
    init: async function (SDP_function, my_connid) {
      await _init(SDP_function, my_connid);
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
    let SDP_function = function (data, to_connid) {
      socket.emit("SDPProcess", {
        message: data,
        to_connid: to_connid,
      });
    };

    socket.on("connect", () => {
      if (socket.connected) {
        appProcces.init(SDP_function, socket.id);
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
