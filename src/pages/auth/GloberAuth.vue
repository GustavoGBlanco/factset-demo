<template>
  <div
    class="container"
    :class="{ 'right-panel-active': display }"
    id="container"
  >
    <base-dialog
      :show="!!payloadFirebase"
      title="Glober"
      @close="handleClose"
      :style="'success'"
    >
      <p>Welcome to the Factset Globant team!</p>
    </base-dialog>
    <base-dialog
      :show="!!errorFirebase"
      title="An error ocurred"
      @close="handleClose"
      :style="'error'"
    >
      <p>{{ errorFirebase }}</p>
    </base-dialog>
    <div v-if="display" class="form-container sign-up-container">
      <form @submit.prevent="submitForm('signUp')">
        <h1>Create Account</h1>
        <label for="emailSignUp" :class="{ invalid: !emailSignUp.isValid }"
          >Email</label
        >
        <input
          id="emailSignUp"
          type="email"
          placeholder="user@globant.com"
          v-model.trim="emailSignUp.val"
          @blur="clearValidity('emailSignUp')"
        />
        <label
          for="passwordlSignUp"
          :class="{ invalid: !passwordSignUp.isValid }"
          >Password</label
        >
        <input
          id="passwordlSignUp"
          type="password"
          placeholder="******"
          v-model.trim="passwordSignUp.val"
          @blur="clearValidity('passwordSignUp')"
        />
        <p v-if="!formIsValidUp" class="invalidMessage">
          The fields do not comply with the connection policies *
        </p>
        <button>Sign Up</button>
      </form>
    </div>
    <div v-else class="form-container sign-in-container">
      <form @submit.prevent="submitForm('signIn')">
        <h1>Sign in</h1>
        <label for="emailSignIn" :class="{ invalid: !emailSignIn.isValid }"
          >Email</label
        >
        <input
          id="emailSignIn"
          type="email"
          placeholder="user@globant.com"
          v-model.trim="emailSignIn.val"
          @blur="clearValidity('emailSignIn')"
        />
        <label
          for="passwordlSignIn"
          :class="{ invalid: !passwordSignIn.isValid }"
          >Password</label
        >
        <input
          id="passwordlSignIn"
          type="password"
          placeholder="******"
          v-model.trim="passwordSignIn.val"
          @blur="clearValidity('passwordSignIn')"
        />
        <p v-if="!formIsValidIn" class="invalidMessage">
          The fields do not comply with the connection policies *
        </p>
        <button>Sign In</button>
      </form>
    </div>
    <div class="overlay-container">
      <div class="overlay">
        <div class="overlay-panel overlay-left">
          <h1>Welcome Glober!</h1>
          <p>To keep connected with us please login with your personal info</p>
          <p>Connection Policies</p>
          <ul class="policies">
            <li>The email field must end in @globant.com</li>
            <li>The password must have a minimum of six characters</li>
          </ul>
          <button class="ghost" id="signIn" @click="display = !display">
            Sign In
          </button>
        </div>
        <div class="overlay-panel overlay-right">
          <h1>Team Factset</h1>
          <p>Enter your glober personal details and start journey with us</p>
          <p>Connection Policies</p>
          <ul class="policies">
            <li>The email field must end in @globant.com</li>
            <li>The password must have a minimum of six characters</li>
          </ul>
          <button class="ghost" id="signUp" @click="display = !display">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      display: "false",
      formIsValidIn: true,
      formIsValidUp: true,
      payloadFirebase: null,
      errorFirebase: null,
      emailSignUp: {
        val: "",
        isValid: true,
      },
      passwordSignUp: {
        val: "",
        isValid: true,
      },
      emailSignIn: {
        val: "",
        isValid: true,
      },
      passwordSignIn: {
        val: "",
        isValid: true,
      },
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    }
  },
  methods: {
    validateField(object, field) {
      if (field === "email")
        return object.val !== "" && object.val.endsWith("@globant.com")
          ? true
          : false;
      else if (field === "password")
        return object.val !== "" && object.val.length > 5 ? true : false;
    },
    clearValidity(input) {
      this[input].isValid = true;
      if(!!this.emailSignUp.isValid && !!this.passwordSignUp.isValid) {
        this.formIsValidUp = true;
      }
      if(!!this.emailSignIn.isValid && !!this.passwordSignIn.isValid) {
        this.formIsValidIn = true;
      }
    },
    clearDataSignUp() {
      this.emailSignUp = {
        val: "",
        isValid: true,
      };
      this.passwordSignUp = {
        val: "",
        isValid: true,
      };
    },
    async submitForm(mode) {
      if (mode === "signIn") {
        this.formIsValidIn = true;
        if (!this.validateField(this.emailSignIn, "email")) {
          this.emailSignIn.isValid = false;
          this.formIsValidIn = false;
        }
        if (!this.validateField(this.passwordSignIn, "password")) {
          this.passwordSignIn.isValid = false;
          this.formIsValidIn = false;
        }
        if (!this.formIsValidIn) return;

        const actionPayload = {
          email: this.emailSignIn.val,
          password: this.passwordSignIn.val,
        };

        try {
          await this.$store.dispatch("login", actionPayload);
          const redirectUrl = "/" + (this.$route.query.redirect || "globers");
          this.$router.replace(redirectUrl);
        } catch (err) {
          this.errorFirebase = err.message || "Failed to signUp, try later.";
        }
        this.clearDataSignUp();
      } else if (mode === "signUp") {
        this.formIsValidUp = true;
        if (!this.validateField(this.emailSignUp, "email")) {
          this.emailSignUp.isValid = false;
          this.formIsValidUp = false;
        }
        if (!this.validateField(this.passwordSignUp, "password")) {
          this.passwordSignUp.isValid = false;
          this.formIsValidUp = false;
        }
        if (!this.formIsValidUp) return;

        const actionPayload = {
          email: this.emailSignUp.val,
          password: this.passwordSignUp.val,
        };

        try {
          await this.$store.dispatch("signup", actionPayload);
          this.payloadFirebase = true;
          
          this.display = !this.display;
        } catch (err) {
          this.errorFirebase = err.message || "Failed to signUp, try later.";
        }
        this.clearDataSignUp();
      }
    },
    handleClose() {
      this.payloadFirebase = null;
      this.errorFirebase = null;
    },
  },
};
</script>

<style scoped>
h1 {
  font-weight: bold;
  margin: 0;
}

h2 {
  text-align: center;
}

p {
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
}

span {
  font-size: 12px;
}

a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

label {
  margin-top: 25px;
  align-self: flex-start;
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
  transition: transform 80ms ease-in;
}

button:active,
button:focus,
button:hover {
  background-color: #5ea40c;
}

button:active {
  transform: scale(0.95);
}

button:focus {
  outline: none;
}

button.ghost {
  background-color: transparent;
  border-color: #ffffff;
}

form {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

input {
  font-family: "Montserrat", sans-serif;
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
}

.container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
  margin-top: 10%;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.overlay {
  background: #bfd732;
  background: -webkit-linear-gradient(to right, #bfd732, #5ea40c);
  background: linear-gradient(to right, #bfd732, #5ea40c);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay-right {
  transform: translateX(20%);
}

.invalidMessage {
  animation-name: error;
  animation-duration: 4s;
  animation-iteration-count: infinite;
  text-align: left;
}
.invalid {
  animation-name: error;
  animation-duration: 4s;
  animation-iteration-count: infinite;
}
.invalid::after {
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

.policies {
  margin-top: -20px;
  text-align: left;
  font-size: 9px;
  font-style: italic;
  margin-bottom: 45px;
}
</style>
