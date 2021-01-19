<template>
  <form class="form" @submit.prevent="submitForm">
    <div class="form-control">
      <label for="emailUser"><h3>Email</h3></label>
      <input
        type="text"
        id="emailUser"
        class="disabled"
        :value="email"
        disabled
        readonly
      />
    </div>
    <div class="form-control" :class="{ invalid: !firstName.isValid }">
      <label for="firstname"><h3>FirstName</h3></label>
      <input
        type="text"
        id="firstname"
        v-model.trim="firstName.val"
        @blur="clearValidity('firstName')"
      />
    </div>
    <div class="form-control" :class="{ invalid: !lastName.isValid }">
      <label for="lastname"><h3>LastName</h3></label>
      <input
        type="text"
        id="lastname"
        v-model.trim="lastName.val"
        @blur="clearValidity('lastName')"
      />
    </div>
    <div class="form-control" :class="{ invalid: !city.isValid }">
      <label for="city"><h3>City</h3></label>
      <input
        type="text"
        id="city"
        v-model.trim="city.val"
        @blur="clearValidity('city')"
      />
    </div>
    <div class="form-control" :class="{ invalid: !selectedOptionTeam.isValid }">
      <label for="team"><h3>Team</h3></label>
      <select
        id="team"
        @change="clearValidity('selectedOptionTeam')"
        v-model.trim="selectedOptionTeam.val"
      >
        <option
          v-for="optionSelectTeam in optionsSelectTeams"
          :key="optionSelectTeam.name"
          :value="optionSelectTeam.name"
        >
          {{ optionSelectTeam.name }}
        </option>
      </select>
    </div>
    <div class="form-control" :class="{ invalid: !role.isValid }">
      <label for="role"><h3>Role</h3></label>
      <select
        id="role"
        @change="updateListSkills(role.val), clearValidity('role')"
        v-model.trim="role.val"
        class="expand-select"
      >
        <option
          v-for="optionRole in optionsRoles"
          :key="optionRole.name"
          :value="optionRole.name"
        >
          {{ optionRole.name }}
        </option>
      </select>
    </div>
    <div class="form-control" :class="{ invalid: !skills.isValid }">
      <label><h3>Skills</h3></label>
      <div v-if="selectedRole">
        <div
          v-for="skill in skillsByRole"
          :key="skill.name + role.val"
          @change="clearValidity('skills')"
          class="checkbox text-justify"
        >
          <input
            type="checkbox"
            @change="updateSkills(skill.name)"
            :id="skill.name"
            :value="skill.name"
          />
          <label :for="skill.name" :class="{ checked: activeClass(skill.name) }"
            ><span>{{ skill.name }}</span></label
          >
        </div>
      </div>
      <div v-else>Please select a role to continue</div>
    </div>
    <p class="invalidMessage" v-if="!formIsValid">Required Fields *</p>
    <button>Join</button>
  </form>
</template>
<script>
export default {
  emits: ["save-data"],
  data() {
    return {
      optionsSelectTeams: [
        { name: "Code" },
        { name: "Trade Execution" },
        { name: "Factset EMS" },
      ],
      optionsRoles: [
        { name: "Delivery Director", skills: "deliveryDirector" },
        { name: "Technical Director", skills: "technicalDirector" },
        { name: "Delivery Manager", skills: "deliveryDirector" },
        { name: "Project Manager", skills: "projectManager" },
        { name: "Client Partner", skills: "clientPartner" },
        { name: "Lead Engineer", skills: "leadEngineer" },
        { name: "Senior Software Engineer", skills: "softwareEngineer" },
        { name: "Software Engineer", skills: "softwareEngineer" },
        { name: "Shadow", skills: "softwareEngineer" },
      ],
      deliveryDirector: [
        { name: "Agile and Learn practice" },
        { name: "Commercial management" },
        { name: "Communication skills" },
        { name: "Financial management" },
        { name: "Life-cycle perspective" },
        { name: "Maintaining delivery momentum" },
        { name: "Making the process work" },
        { name: "Planning" },
        { name: "Team dynamics and collaboration" },
      ],
      technicalDirector: [
        { name: "Speaking" },
        { name: "Monitoring" },
        { name: "Coordination" },
        { name: "Reading comprehension" },
        { name: "Active listening" },
        { name: "Critical thinking" },
        { name: "Time Managament" },
        { name: "Management of personnel resources" },
        { name: "Writing" },
        { name: "Social perceptiveness" },
        { name: "Persuasion" },
        { name: "Complex problem solving" },
        { name: "Judgment and decision making" },
        { name: "Systems analysis" },
        { name: "Active learning" },
        { name: "Learning strategies" },
        { name: "Systems evaluation" },
        { name: "Negotiation" },
      ],
      projectManager: [
        { name: "Communication" },
        { name: "Leadership" },
        { name: "Organization" },
        { name: "Negotiation" },
        { name: "Team management" },
        { name: "Time management" },
        { name: "Risk management" },
        { name: "Problem-solving" },
        { name: "Budget management" },
      ],
      clientPartner: [
        { name: "Negotiate business contracts" },
        { name: "Develop customized programs" },
        { name: "Provide client consultations" },
        { name: "Develop business proposals" },
        { name: "Build positive and productive relationships with clients." },
        { name: "Develop account strategies" },
        { name: "Develop new business opportunities" },
        { name: "Provide outstanding services" },
        { name: "Address customer concerns" },
      ],
      leadEngineer: [
        { name: "The ability to establish trust" },
        { name: "Excellent communication skills" },
        { name: "A leadership style that reflects your team" },
        { name: "A strong vision for the future" },
        { name: "Have more than just the right qualifications" },
        { name: "Possess top-notch management skills" },
        { name: "Be able to take ownership" },
        { name: "focus" },
      ],
      softwareEngineer: [
        { name: "Analysis" },
        { name: "Software design" },
        { name: "Software documentation" },
        { name: "Software testing" },
        { name: "Teamwork" },
        { name: "Programming skills" },
        { name: "Software development fundamentals and process" },
        { name: "Software requirements" },
        { name: "Software architecture" },
        { name: "Self-directed" },
        { name: "Multi-tasking" },
        { name: "Communication Skills" },
        { name: "Coding" },
        { name: "Object-oriented design" },
        { name: "Computer programming" },
        { name: "UX / UI" },
      ],
      searchSkill: null,
      email: localStorage.getItem("email"),
      firstName: {
        val: "",
        isValid: true,
      },
      lastName: {
        val: "",
        isValid: true,
      },
      city: {
        val: "",
        isValid: true,
      },
      selectedOptionTeam: {
        val: "",
        isValid: true,
      },
      role: {
        val: "",
        isValid: true,
      },
      skills: {
        val: [],
        isValid: true,
      },
      formIsValid: true,
    };
  },
  created() {
    this.firstName.val = this.$store.getters["globers/getFirstName"];
    this.lastName.val = this.$store.getters["globers/getLastName"];
    this.city.val = this.$store.getters["globers/getCity"];
    this.selectedOptionTeam.val = this.$store.getters["globers/getTeam"];
    this.role.val = this.$store.getters["globers/getRol"];
    this.updateListSkills(this.role.val);
    setTimeout(() => {
      const getOptionSelected = document.getElementsByClassName("checked");
      getOptionSelected.forEach((elementChild) => {
        elementChild.click();
      });
      window.scrollTo(0, 0);
    }, 0);
  },
  watch: {},
  computed: {
    skillsByRole: function () {
      return this.searchSkill;
    },
    selectedRole: function () {
      return this.role.val && this.role.val[0].length > 0 ? true : false;
    },
  },
  methods: {
    activeClass(optionSkill) {
      let filterClass = null;
      if (this.$store.getters["globers/getSkills"].length > 0) {
        this.$store.getters["globers/getSkills"].forEach((skill) => {
          if (skill === optionSkill) {
            filterClass = true;
          }
        });
      }
      return filterClass;
    },
    updateListSkills(role) {
      this.cleanSkillsOption();
      const allData = Object.assign({}, this.$data);
      this.optionsRoles.forEach((element) => {
        if (element.name === role) {
          const listSkills = Object.assign({}, allData[element.skills]);
          this.searchSkill = listSkills;
          return;
        }
      });
    },
    cleanSkillsOption() {
      this.skills.val = [];
    },
    updateSkills(skill) {
      if (!this.skills.val.find((skillInArray) => skillInArray === skill))
        this.skills.val.push(skill);
      else {
        for (const skillArray in this.skills.val) {
          if (skill === this.skills.val[skillArray]) {
            this.skills.val[skillArray] = null;
          }
        }
      }
      const newArraySkills = this.skills.val.filter(
        (element) => element !== null
      );
      this.skills.val = newArraySkills;
    },
    clearValidity(input) {
      this[input].isValid = true;
    },
    validateForm() {
      this.formIsValid = true;
      if (this.firstName.val === "") {
        this.firstName.isValid = false;
        this.formIsValid = false;
      }
      if (this.lastName.val === "") {
        this.lastName.isValid = false;
        this.formIsValid = false;
      }
      if (this.city.val === "") {
        this.city.isValid = false;
        this.formIsValid = false;
      }
      if (this.selectedOptionTeam.val === "") {
        this.selectedOptionTeam.isValid = false;
        this.formIsValid = false;
      }
      if (this.role.val === "") {
        this.role.isValid = false;
        this.formIsValid = false;
      }
      if (this.skills.val.length === 0) {
        this.skills.isValid = false;
        this.formIsValid = false;
      }
    },
    submitForm() {
      this.validateForm();
      if (!this.formIsValid) {
        return;
      }
      const formData = {
        email: this.email,
        first: this.firstName.val,
        last: this.lastName.val,
        city: this.city.val,
        team: this.selectedOptionTeam.val,
        rol: this.role.val,
        skill: this.skills.val,
      };
      this.$emit("save-data", formData);
    },
  },
};
</script>
<style scoped>
.form {
  background-color: #f6f5f7;
  border-radius: 5px;
  box-shadow: 0px 10px 20px -10px rgba(0, 0, 0, 0.75);
  padding: 10px;
  position: relative;
  width: 350px;
  max-width: 100%;
  text-align: center;
  margin-top: 40px;
  margin-left: 13%;
  margin-bottom: 40px;
}
.form-control {
  margin: 3rem 0;
}
label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}
input {
  cursor: pointer;
  border: none;
  background-color: white;
  box-shadow: 0px 5px 20px -15px rgba(0, 0, 0, 0.75);
  border-radius: 3px;
  padding: 10px 25px;
  font-family: "Montserrat", sans-serif;
}
input:focus {
  background-color: white;
}
select {
  cursor: pointer;
  border: none;
  background-color: white;
  box-shadow: 0px 5px 20px -15px rgba(0, 0, 0, 0.75);
  border-radius: 3px;
  text-align: center;
  padding: 10px;
  font-family: "Montserrat", sans-serif;
}
select:focus {
  color: white;
  background: #00866a linear-gradient(0deg, #00866a 0%, #00866a 100%);
}
h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}
.disabled {
  border: 1px solid black;
  background-color: #f6f5f7;
  color: black;
  cursor: no-drop;;
}
.text-justify {
  padding: 5px;
  margin-left: 15%;
  text-align: justify;
}
.checkbox label {
  position: relative;
  min-height: 34px;
  display: block;
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
.checkbox label span:hover {
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
button {
  background-color: #5ea40c;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  box-shadow: 0px 5px 20px -15px rgba(0, 0, 0, 0.75);
  border-radius: 3px;
  cursor: pointer;
}
button:focus,
button:hover,
button:active {
  background-color: #00866a;
}
.invalidMessage {
  animation-name: error;
  animation-duration: 4s;
  animation-iteration-count: infinite;
  text-align: left;
}
.invalid label h3 {
  animation-name: error;
  animation-duration: 4s;
  animation-iteration-count: infinite;
}
.invalid label h3::after {
  content: " *";
}

@keyframes error {
  from {
    color: white;
  }
  to {
    color: red;
  }
}
</style>