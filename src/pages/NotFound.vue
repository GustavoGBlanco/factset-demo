<template>
  <section>
    <the-header></the-header>
    <base-card>
      <h2>Page not found</h2>
      <p>
        This page could not be found - maybe check out all our
        <router-link to="/Globers">Globers</router-link>.
      </p>
    </base-card>
  </section>
</template>

<script>
import TheHeader from "../components/layout/TheHeader";

export default {
  components: {
    TheHeader,
  },
};
</script>
<style scoped>
h2 {
  text-align: center;
}
a,
a:hover,
a:focus,
a:active {
  text-decoration: none;
  color: #00866a;
}
</style>