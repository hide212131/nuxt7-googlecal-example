<template>
  <f7-page>

    <f7-navbar>
      <f7-nav-left>
        <f7-link v-if="calendarEditing" text="登録" v-on:click="submitCalendarEvent"></f7-link>
      </f7-nav-left>
      <f7-nav-title>Shift Pad</f7-nav-title>
      <f7-nav-right>
        <f7-link v-if="calendarEditing" text="キャンセル" v-on:click="cancelCalendarEvent"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <!-- Side Panelが効かないので使わない -->

    <!-- animatedの表示が変なので使わない -->
    <f7-tabs>
      <!-- active属性が効かないので直接class指定 -->
      <f7-tab id="tab_cal" class="tab-active">
        <calendar ref="cal" v-on:changed="onCalendarChanged" ></calendar>
      </f7-tab>
      <f7-tab id="tab_salary" >
      </f7-tab>
      <f7-tab id="tab_settings" >
          <f7-list class="components-list searchbar-found">
            <f7-list-item link="/googlesignin/" title="Google Calendar連携"></f7-list-item>
          </f7-list>
      </f7-tab>
    </f7-tabs>

    <f7-toolbar tabbar labels>
      <f7-link icon-f7="calendar" text="カレンダー" tab-link="#tab_cal"></f7-link>
      <!-- <f7-link icon-f7="keyboard" text="給与計算" tab-link="#tab_salary"></f7-link> -->
      <f7-link icon-f7="gear" text="設定" tab-link="#tab_settings"></f7-link>
    </f7-toolbar>

    <login @success="onSignInSuccess"></login>
  </f7-page>

</template>

<script>
import login from "~/pages/login.vue";
import calendar from "~/pages/calendar.vue";
import { mapGetters } from "vuex";
import { googleInitClientFromLocalStorage } from "~/utils/google-api";

export default {
  async mounted() {
    try {
      await googleInitClientFromLocalStorage(this.$store);
    } catch (err) {
      this.$store.commit("ERROR", ["googleInitClientFromLocalStorage failed", err]);
      this.$f7router.navigate("/error/");
    }
  },
  components: {
    calendar,
    login
  },
  data() {
    return {
      calendarEditing: false
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "loggedUser"])
  },
  methods: {
    onSignInSuccess() {
      this.$refs.cal.refreshEvents()
    },
    onCalendarChanged() {
      this.calendarEditing = this.$refs.cal.isEditing;
    },
    submitCalendarEvent() {
      const self = this;
      let error = null;
      if (gapi.client != null) {
        let tryInsert = [].concat(this.$refs.cal.selected);
        this.$refs.cal.selected = [];
        tryInsert.forEach((event, index) => {
          const newEvent = {
            summary: this.$store.state.eventTitle,
            start: {
              date: event.start.toISOString()
            },
            end: {
              date: event.start.toISOString()
            }
          };
          //console.log("newEvent", newEvent)
          const request = gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: newEvent
          });
          request.execute(function(e) {
            console.log(e);
            if (e.error == undefined) {
              // selected -> base
              event.id = e.id;
              self.$refs.cal.commitInsert(event);
            } else {
              self.$refs.cal.selected.push(event);
              if (error == null) {
                error = e;
                self.error("google calendar insert failed.", e);
              }
            }
          });
        });

        let tryDelete = [].concat(this.$refs.cal.unselected);
        console.log("★", tryDelete);
        this.$refs.cal.unselected = [];
        tryDelete.forEach((event, index) => {
          const request = gapi.client.calendar.events.delete({
            calendarId: "primary",
            eventId: event.id
          });
          request.execute(function(e) {
            if (e.error == undefined) {
              // unselected -> base
              self.$refs.cal.commitDelete(event);
            } else {
              self.$refs.cal.unselected.push(event);
              if (error == null) {
                error = e;
                self.error("google calendar delete failed.", e);
              }
            }
          });
        });
      } else {
        this.error("gapi.client is null", null);
      }
    },
    cancelCalendarEvent() {
      this.$refs.cal.cancelEditing();
    },
    error(msg, err) {
      console.log("ERROR", msg, err);
      this.$store.commit("ERROR", [msg, err]);
      this.$f7router.navigate("/error/");
    }
  }
};
</script>
