<template>
    <full-calendar ref="calendar" defaultView="month" :events="events" :event-sources="eventSources" @day-click="dayClick" :config="config"></full-calendar>
</template>


<script>
import { FullCalendar } from "vue-full-calendar";
import { mapState } from "vuex";
import { mapMutations } from "vuex";
import * as api from "~/utils/google-api";
import * as eSet from "~/utils/events";

export default {
  components: {
    FullCalendar
  },
  data() {
    return {
      config: {
        views: {
          month: {
            titleFormat: "YYYY年MM月"
          }
        },
        theme: false,
        defaultView: "month",
        locale: "ja",
        header: {
          left: "prev",
          center: "title",
          right: "next"
        },
        // If it is not specified, the vertical width will be shortened
        height: "auto"
      },
      base: [],
      selected: [],
      unselected: []
    };
  },

  methods: {
    refreshEvents() {
      this.$refs.calendar.$emit("refetch-events");
    },
    dayClick(date, jsEvent, view) {
      const baseExists = eSet.contains(this.base, date);
      const eventSelected = eSet.contains(this.selected, date);
      const eventUnselected = eSet.contains(this.unselected, date);
      if (baseExists) {
        if (eventUnselected) {
          this.unselected = eSet.remove(this.unselected, date);
        } else {
          const event = eSet.getByDate(this.base, date);
          this.unselected.push(event);
        }
      } else {
        // event not exsits
        if (eventSelected) {
          this.selected = eSet.remove(this.selected, date);
        } else {
          this.selected.push(this.newEvent(date));
        }
      }
    },

    newEvent(d, id) {
      if (d.diff == undefined) {
        d = this.$refs.calendar.fireMethod("moment", d);
      }
      return {
        start: d,
        color: "green",
        rendering: "background",
        id: id
      };
    },
    cancelEditing() {
      this.selected = [];
      this.unselected = [];
    },
    commitInsert(event) {
      event.color = "green";
      this.base.push(event);
    },
    commitDelete(event) {
      eSet.remove(this.base, event.start);
    }
  },
  watch: {
    isEditing: function(oldValue, newValue) {
      this.$emit("changed");
    }
  },
  computed: {
    isEditing() {
      return this.selected.length != 0 || this.unselected.length != 0;
    },

    events() {
      // add selected  to events
      // remove dupulicate date and marge
      let addevts = this.selected.filter(
        s => !eSet.contains(this.base, s.start)
      );
      let events = this.base.concat(addevts);

      // unselected filter
      events.forEach(e => {
        if (eSet.contains(this.selected, e.start)) {
          e.color = "red";
        } else if (eSet.contains(this.unselected, e.start)) {
          e.color = "gray";
        } else {
          e.color = "green";
        }
      });
      return events;
    },

    eventSources() {
      const self = this;
      return [
        {
          async events(start, end, timezone, callback) {
            if (api.isAvailable()) {
              try {
                const response = await api.list(start, end);
                // get event sources
                let events = response.result.items
                  .filter(item => item.summary == self.$store.state.eventTitle)
                  .map(item => {
                    let when = item.start.dateTime;
                    if (!when) {
                      when = item.start.date;
                    }
                    return self.newEvent(when, item.id);
                  });
                self.base = events;
              } catch (e) {
                self.$store.commit("ERROR", ["api.list", e]);
                self.$f7router.navigate("/error/");
              }
            }
            callback([]);
          }
        }
      ];
    }
  }
};
</script>

<style>
@import "~fullcalendar/dist/fullcalendar.css";
</style>
