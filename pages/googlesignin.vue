<template>
  <f7-page>
    <f7-navbar back-link="Back">{{$t('googlesignin.title')}}</f7-navbar>
    <f7-block-title>{{$t('googlesignin.account')}}</f7-block-title>
    <f7-block strong>
      <f7-label v-if="isAuthenticated">
          {{ loggedUser.getBasicProfile().getName() }} {{$t('googlesignin.signedin')}}
          <f7-link v-on:click="onSignOut">{{$t('googlesignin.signout')}}</f7-link>
      </f7-label>
    </f7-block>
  </f7-page>
</template>

<script>
import { mapGetters } from "vuex";
import localStorage from 'store'

export default {
  computed: mapGetters([
    'isAuthenticated',
    'loggedUser'
  ]),
  methods: {
    onSignOut() {
      localStorage.set("login", null)
      let auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function() {
        console.log("User signed out.");
      });
      this.$store.commit("SET_USER", null);
    },
  }
};
</script>

