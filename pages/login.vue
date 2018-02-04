<template>
  <f7-login-screen :opened="!isAuthenticated" >
    <f7-page login-screen>
      <f7-login-screen-title>{{$t('title')}}</f7-login-screen-title>
      <f7-list>
        <f7-list-item>
          <g-signin-button align="center" ref="gSigninButton"
            :params="googleSignInParams"
            @success="onSignInSuccess"
            @error="onSignInError">
            {{$t('links.googlesignin')}}
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
  mounted() {
    let self = this
    this.$refs.gSigninButton.$refs.signinBtn.onclick = () => {
      self.$store.commit("SET_PROGRESS", true);
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
        await googleInitClientNew(googleUser, this.$store);
        this.$emit("success");
      } catch (err) {
        this.$store.commit("ERROR", ["gapi.client.init failed", err]);
        this.$f7router.navigate("/error/");
      } finally {
        this.$store.commit("SET_PROGRESS", false);
      }
    },
    onSignInError(error) {
      this.$store.commit("ERROR", ["Google SignIn failed", error]);
      this.$f7router.navigate("/error/");
      this.$store.commit("SET_PROGRESS", false);
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