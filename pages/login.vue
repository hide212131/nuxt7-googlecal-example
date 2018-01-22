<template>
  <f7-page login-screen>
    <f7-login-screen-title>Shift Pad</f7-login-screen-title>
    <f7-list>
      <f7-list-item>
        <g-signin-button align="center" close-login-screen
          :params="googleSignInParams"
          @success="onSignInSuccess"
          @error="onSignInError">
          Googleにサインイン
        </g-signin-button>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
import { mapGetters } from "vuex";
import Env from '~/env.js'

// function onSignIn(googleUser) {
//   alert("onSignIn(googleUser)");
//   // Useful data for your client-side scripts:
//   let profile = googleUser.getBasicProfile();
//   console.log("ID: " + profile.getId()); // Don't send this directly to your server!
//   console.log("Full Name: " + profile.getName());
//   console.log("Given Name: " + profile.getGivenName());
//   console.log("Family Name: " + profile.getFamilyName());
//   console.log("Image URL: " + profile.getImageUrl());
//   console.log("Email: " + profile.getEmail());

//   // The ID token you need to pass to your backend:
//   let id_token = googleUser.getAuthResponse().id_token;
//   console.log("ID Token: " + id_token);
// }

// function signOut() {
//   let auth2 = gapi.auth2.getAuthInstance();
//   auth2.signOut().then(function() {
//     console.log("User signed out.");
//   });
// }
const CLIENT_ID = Env.google.CLIENT_ID;
const API_KEY = Env.google.API_KEY;
// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar";

export default {
  computed: mapGetters(["isAuthenticated", "loggedUser"]),
  data() {
    return {
      /**
       * The Auth2 parameters, as seen on
       * https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams.
       * As the very least, a valid client_id must present.
       * @type {Object}
       */
      googleSignInParams: {
        client_id: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
        apiKey: API_KEY
      }
    };
  },
  methods: {
    onSignInSuccess(googleUser) {
      // `googleUser` is the GoogleUser object that represents the just-signed-in user.
      // See https://developers.google.com/identity/sign-in/web/reference#users
      // Useful data for your client-side scripts:
      let profile = googleUser.getBasicProfile();
      //   console.log("ID: " + profile.getId()); // Don't send this directly to your server!
      //   console.log("Full Name: " + profile.getName());
      //   console.log("Given Name: " + profile.getGivenName());
      //   console.log("Family Name: " + profile.getFamilyName());
      //   console.log("Image URL: " + profile.getImageUrl());
      //   console.log("Email: " + profile.getEmail());

      // The ID token you need to pass to your backend:
      let id_token = googleUser.getAuthResponse().id_token;
      //   console.log("ID Token: " + id_token);

      this.$store.commit("SET_USER", googleUser);

      gapi.load("client", this.initClient, function(e) {
        console.log("loadError", e);
      });
    },
    onSignInError(error) {
      // `error` contains any error occurred.
      console.log("OH NOES", error);
      this.$store.commit("ERROR", ["Google SignIn failed", error]);
      this.$f7router.navigate("/error/");
    },
    initClient() {
      const self = this;
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        })
        .then(
          function(response) {
            self.$emit("success");
            console.log("Success: ", response, self);
            self.$f7router.navigate("/");
          },
          function(reason) {
            console.log("Error:gapi.client.init", reason);
            self.$store.commit("ERROR",["gapi.client.init failed", reason]);
            self.$f7router.navigate("/error/");
          }
        );
    }
  }
};
</script>

<style>
.g-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #3c82f7;
  color: #fff;
  box-shadow: 0 3px 0 #0f69ff;
  margin: 0 auto;
}
</style>