<template>
  <div class="login">
    <form @submit.prevent="handleSubmit">
      <label>Email</label>
      <input
        type="email"
        required
        placeholder="email"
        name="email"
        id="email"
        v-model="email"
      />
      <label>Password</label>
      <input
        type="password"
        required
        placeholder="password"
        name="password"
        id="password"
        v-model="password"
      />
      <div class="error">{{ error }}</div>
      <button :disabled="!email || !password">Login</button>
    </form>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import useLogin from "../composables/useLogin";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const email = ref("");
    const password = ref("");

    const { error, login } = useLogin();

    const handleSubmit = async () => {
      error.value = null;
      const user = await login(email.value, password.value);
      if (user && !error.value) {
        router.push({ name: "Home" });
      }
    };

    return {
      email,
      password,
      error,
      handleSubmit,
    };
  },
};
</script>

<style>
.login form {
  max-width: 420px;
  margin: 30px auto;
  background: white;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}

.login label {
  color: #888;
  display: inline-block;
  margin: 25px 0 15px;
  font-size: 0.6em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}

.login input {
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #888;
  color: #555;
}

.login button {
  background: #0b6dff;
  border: 0;
  padding: 10px 20px;
  margin-top: 20px;
  color: white;
  border-radius: 20px;
}

.login button:disabled {
  background: #555;
  color: #888;
}

.error {
  display: block;
  color: #ff0062;
  text-align: center;
  margin-top: 20px;
  font-size: 1em;
  font-weight: bold;
}
</style>