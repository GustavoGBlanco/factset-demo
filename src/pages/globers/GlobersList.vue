<template>
  <div>
    <the-header></the-header>
    <base-dialog
      :show="!!error"
      title="An error occurred!"
      @close="handleError"
      :style="'error'"
    ></base-dialog>
    <div>
      <team-filter @change-filter="setFilters"></team-filter>
    </div>
    <base-card>
      <div>
        <button v-if="hasGlobers" id="buttonRefresh" @click="loadGlobers(true)">
          Refresh
        </button>
      </div>
      <div v-if="isLoading">
        <base-spinner></base-spinner>
      </div>
      <div v-if="!hasGlobers && !isLoading" class="text-center">
        <h3>No globers found.</h3>
        <p>Go the <i>profile</i> option inside the header and create yours!</p>
      </div>
      <div>
        <glober-detail
          v-for="glober in filteredGlobers"
          :key="glober.id"
          :id="glober.id"
          :email="glober.email"
          :first-name="glober.firstName"
          :last-name="glober.lastName"
          :city="glober.city"
          :team="glober.team"
          :rol="glober.rol"
          :skills="glober.skills"
        ></glober-detail>
      </div>
    </base-card>
  </div>
</template>
<script>
import TheHeader from "../../components/layout/TheHeader";
import GloberDetail from "../../components/globers/GloberDetail.vue";
import TeamFilter from "../../components/teams/TeamFilter.vue";

export default {
  components: {
    TheHeader,
    GloberDetail,
    TeamFilter,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      activeFilters: {
        code: true,
        tradeExecution: true,
        factsetEMS: true,
      },
    };
  },
  computed: {
    filteredGlobers() {
      const globers = this.$store.getters["globers/globers"];
      return globers.filter((glober) => {
        if (this.activeFilters.code && glober.team === "Code") {
          return true;
        }
        if (
          this.activeFilters.tradeExecution &&
          glober.team === "Trade Execution"
        ) {
          return true;
        }
        if (this.activeFilters.factsetEMS && glober.team === "Factset EMS") {
          return true;
        }
        return false;
      });
    },
    hasGlobers() {
      return !this.isLoading && this.$store.getters["globers/hasGlobers"];
    },
  },
  created() {
    this.loadGlobers();
    setTimeout(() => {
      if (this.hasGlobers) {
        document.getElementById("buttonRefresh").click();
      }
    }, 0);
    setTimeout(() => {
      if (this.$route.query.reload) {
        document.getElementById("buttonRefresh").click();
      }
    }, 1000);
  },
  methods: {
    setFilters(updatedFilters) {
      this.activeFilters = updatedFilters;
    },
    async loadGlobers(refresh = false) {
      this.isLoading = true;
      try {
        await this.$store.dispatch("globers/loadGlobers", {
          forceRefresh: refresh,
        });
      } catch (error) {
        this.error = error.message || "Something went wrong!";
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
h3 {
  margin: 10px 0;
}

h6 {
  margin: 5px 0;
  text-transform: uppercase;
}

p {
  font-size: 14px;
  line-height: 21px;
}

.text-center {
  text-align: center;
}
button {
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid #bfd732;
  background-color: #bfd732;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-left: 32%;
  transition: transform 80ms ease-in;
}

button:active,
button:focus,
button:hover {
  background-color: #5ea40c;
}
</style>