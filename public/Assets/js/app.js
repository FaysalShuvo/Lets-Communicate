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
  function init(uid, mid) {
    alert("From App Js");
  }

  return {
    _init: function (uid, mid) {
      init(uid, mid);
    },
  };
})();
