<template>
    <full-calendar ref="calendar" defaultView="month" :events="events" :event-sources="eventSources" @day-click="dayClick" :config="config"></full-calendar>
</template>


<script>
import { FullCalendar } from "vue-full-calendar";
import { mapState } from "vuex";
import { mapMutations } from "vuex";
import { contains, getByDate, isSame } from "~/utils/date";
import * as api from "~/utils/google-api";

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
        // 指定しないと縦幅が短くなってしまう
        height: "auto"
        // eventClick: event => {
        //   console.log("eventClick", event);
        //   this.selected = event;
        // }
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
      console.log(
        "dayClick: date, events, selected, unselected",
        date,
        this.events,
        this.selected,
        this.unselected
      );
      const baseExists = contains(this.base, date);
      const eventSelected = contains(this.selected, date);
      const eventUnselected = contains(this.unselected, date);
      if (baseExists) {
        if (eventUnselected) {
          this.unselected = this.unselected.filter(e => !isSame(e.start, date));
        } else {
          const event = this.base.find(e => isSame(e.start, date));
          this.unselected.push(event);
        }
      } else {
        // event not exsits
        if (eventSelected) {
          this.selected = this.selected.filter(e => !isSame(e.start, date));
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
      this.base.splice(
        this.base.findIndex(b => isSame(b.start, event.start)),
        1
      );
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
        s => this.base.find(b => isSame(s.start, b.start)) == null
      );
      let events = this.base.concat(addevts);

      // unselected filter
      events.forEach(e => {
        if (this.selected.find(u => isSame(u.start, e.start)) != null) {
          e.color = "red";
        } else if (
          this.unselected.find(u => isSame(u.start, e.start)) != null
        ) {
          e.color = "gray";
        } else {
          e.color = "green";
        }
      });

      console.log(
        "(base, selected, unselected) => events",
        this.base,
        this.selected,
        this.unselected,
        events
      );

      return events;
    },

    eventSources() {
      const self = this;
      return [
        {
          async events(start, end, timezone, callback) {
            console.log(
              "events->callback",
              start.toISOString(),
              end.toISOString()
            );

            if (api.isAvailable()) {
              try {
                const response = await api.list(start, end);
                // get event sources
                console.log("response", response);
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
                console.log("self.base", self.base);
              } catch (e) {
                console.log("Error: api.list" + e);
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
