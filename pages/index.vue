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
import * as api from "~/utils/google-api";
import { contains, getByDate, isSame } from "~/utils/date";

export default {
  async mounted() {
    try {
      await api.initClientFromLocalStorage(this.$store);
    } catch (err) {
      this.$store.commit("ERROR", [
        "initClientFromLocalStorage failed",
        err
      ]);
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
      this.$refs.cal.refreshEvents();
    },
    onCalendarChanged() {
      this.calendarEditing = this.$refs.cal.isEditing;
    },
    async submitCalendarEvent() {
      const self = this;
      let error = null;
      if (api.isAvailable()) {
        this.openPreloader();
        let batch = api.newBatch();

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
          const request = api.insertRequest(newEvent);
          batch.add(request);
        });

        let tryDelete = [].concat(this.$refs.cal.unselected);
        this.$refs.cal.unselected = [];
        tryDelete.forEach((event, index) => {
          const request = api.deleteRequest(event.id);
          batch.add(request);
        });

        try {
          const responseMap = await api.execute(batch); 
          tryInsert.forEach((event, index) => {
            let item = Object.values(responseMap)
              .filter(item => item.result != undefined)
              .find(item => isSame(event.start, item.result.start.date));
            if ((item != null) & (item.result.status == "confirmed")) {
              event.id = item.result.id;
              self.$refs.cal.commitInsert(event);
            }
          });
          tryDelete.forEach((event, index) => {
            self.$refs.cal.commitDelete(event);
          });
        } catch (err) {
          if (error == null) {
            error = err;
            self.error("api access failed.", error);
          }
        }
        this.closePreloader();

      } else {
        this.error("api is not available.", null);
      }
    },
    cancelCalendarEvent() {
      this.$refs.cal.cancelEditing();
    },
    error(msg, err) {
      console.log("ERROR", msg, err);
      this.$store.commit("ERROR", [msg, err]);
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
