<template>
  <f7-login-screen :opened="!isAuthenticated" >
    <f7-page login-screen>
      <f7-login-screen-title>Shift Pad</f7-login-screen-title>
      <f7-list>
        <f7-list-item>
          <g-signin-button align="center"
            :params="googleSignInParams"
            @success="onSignInSuccess"
            @error="onSignInError">
            Googleにサインイン
          </g-signin-button>
        </f7-list-item>
      </f7-list>
    </f7-page>
  </f7-login-screen>
</template>

<script>
import { mapGetters } from "vuex";
import { googleSignInParams, googleInitClientNew } from "~/utils/google-api";
import { f7LoginScreen } from "framework7-vue";

export default {
  data() {
    return {
      googleSignInParams
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "loggedUser"])
  },
  components: {
    f7LoginScreen
  },
  watch: {
    loggedUser: function(newValue, oldValue) {
      if (oldValue == null && newValue != null) {
        this.$emit("success");
      }
    }
  },
  methods: {
    async onSignInSuccess(googleUser) {
      try {
        this.openPreloader();
        await googleInitClientNew(googleUser, this.$store);
        this.$emit("success");
        this.closePreloader();
      } catch (err) {
        this.$store.commit("ERROR", ["gapi.client.init failed", err]);
        this.$f7router.navigate("/error/");
        this.closePreloader();
      }
    },
    onSignInError(error) {
      this.$store.commit("ERROR", ["Google SignIn failed", error]);
      this.$f7router.navigate("/error/");
    },
    openPreloader() {
      const app = this.$f7;
      app.dialog.preloader();
    },
    closePreloader() {
      const app = this.$f7;
      app.dialog.close();
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