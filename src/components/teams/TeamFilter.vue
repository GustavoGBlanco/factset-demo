<template>
  <div class="filter">
    <h2>Find Your Team</h2>
    <div class="checkbox">
      <input type="checkbox" id="code" checked @change="setFilter" />
      <label for="code"><span>Code</span></label>
    </div>
    <div class="checkbox">
      <input type="checkbox" id="tradeExecution" checked @change="setFilter" />
      <label for="tradeExecution"><span>Trade Execution</span></label>
    </div>
    <div class="checkbox">
      <input type="checkbox" id="factsetEMS" checked @change="setFilter" />
      <label for="factsetEMS"><span>Factset EMS</span></label>
    </div>
  </div>
</template>
<script>
export default {
  emits: ["change-filter"],
  data() {
    return {
      filters: {
        code: true,
        tradeExecution: true,
        factsetEMS: true,
      },
    };
  },
  methods: {
    setFilter(event) {
      const inputId = event.target.id;
      const isActive = event.target.checked;
      const updatedFilters = {
        ...this.filters,
        [inputId]: isActive,
      };
      this.filters = updatedFilters;
      this.$emit("change-filter", updatedFilters);
    },
  },
};
</script>
<style scoped>
.filter {
  border-radius: 3px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  margin: 2rem auto;
  text-align: center;
  background-color: white;
}
.checkbox label {
  position: relative;
  min-height: 34px;
  display: flex;
  padding-left: 40px;
  margin-bottom: 0;
  font-weight: normal;
  cursor: pointer;
}
.checkbox label span {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.checkbox input[type="checkbox"]:checked + label,
.checkbox label span:hover,
.checked {
  color: #00866a;
}
.checkbox label:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0px;
  margin: 4px;
  width: 22px;
  height: 22px;
  transition: transform 0.28s ease;
  border-radius: 3px;
  border: 1px solid black;
}
.checkbox label:hover::before,
.checkbox label:focus::before,
.checkbox label:active::before {
  border: 1px solid #00866a;
}
.checkbox label:after {
  content: "";
  display: block;
  width: 10px;
  height: 5px;
  border-bottom: 1px solid #00866a;
  border-left: 1px solid #00866a;
  transform: rotate(-45deg) scale(0);
  transition: transform ease 0.25s;
  position: absolute;
  top: 12px;
  left: 10px;
}
.checkbox input[type="checkbox"] {
  width: auto;
  opacity: 1e-8;
  position: absolute;
  left: 0;
  margin-left: -20px;
}
.checkbox input[type="checkbox"]:checked ~ label:before,
label:before {
  border: 1px solid #00866a;
}
.checkbox input[type="checkbox"]:checked ~ label:after {
  transform: rotate(-45deg) scale(1);
}
.checkbox input[type="checkbox"]:focus + label::before {
  outline: 0;
}
</style>