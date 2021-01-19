<template>
  <section>
    <the-header></the-header>
    <base-card>
      <h2>Register as a member Factset Team!</h2>
      <glober-form @save-data="saveData"></glober-form>
    </base-card>
  </section>
</template>
<script>
import TheHeader from "../../components/layout/TheHeader";
import GloberForm from "../../components/globers/GloberForm.vue";

export default {
  components: {
    TheHeader,
    GloberForm,
  },
  methods: {
    saveData(data) {
      this.$store.dispatch("globers/registerGlober", data);
      this.$router.replace("/globers?reload=true");
    },
  },
};
</script>