import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "yourApiKey",
  authDomain: "yourAuthDomain",
  projectId: "yourProjectId",
  storageBucket: "yourStorageBucket",
  messagingSenderId: "yourMessagingSenderId",
  appId: "yourAppId1"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export { auth, firebase };
