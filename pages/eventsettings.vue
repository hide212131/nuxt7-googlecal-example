<template>
  <f7-page>
    <f7-navbar back-link="Back">Event Settings</f7-navbar>
    <f7-block-title>Event Title</f7-block-title>
    <f7-block strong>
      <f7-input type="text" placeholder="My Event" v-model="eventTitle" clear-button></f7-input>
    </f7-block>
  </f7-page>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import localStorage from "store";

export default {
  computed: {
    eventTitle: {
      get() {
        return this.$store.state.eventTitle;
      },
      set(event) {
          console.log("value", event)
        this.$store.commit("SET_EVENT_TITLE", event.target.value);
      }
    }
  }
};
</script>

