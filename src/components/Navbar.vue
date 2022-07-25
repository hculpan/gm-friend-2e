<template>
  <div class="container">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark" v-if="user">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">GM Friend 2E</a>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link :to="{ name: 'Combat' }" custom v-slot="{ navigate, href, route }">
                <a class="nav-link" :href="href" @click="navigate">{{ route.name }}</a>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'Monster Search' }" custom v-slot="{ navigate, href }">
                <a class="nav-link" :href="href" @click="navigate">Monsters</a>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'Reaction Check' }" custom v-slot="{ navigate, href, route }">
                <a class="nav-link" :href="href" @click="navigate">{{ route.name }}</a>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'Treasure' }" custom v-slot="{ navigate, href, route }">
                <a class="nav-link" :href="href" @click="navigate">{{ route.name }}</a>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'Names' }" custom v-slot="{ navigate, href, route }">
                <a class="nav-link" :href="href" @click="navigate">{{ route.name }}</a>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'NPCs' }" custom v-slot="{ navigate, href, route }">
                <a class="nav-link" :href="href" @click="navigate">{{ route.name }}</a>
              </router-link>
            </li>
          </ul>
          <span class="navbar-text">
            <router-link @click="handleLogout" :to="{ name: 'Login' }">
              {{ user.email }}
            </router-link>
          </span>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import useLogout from "../composables/useLogout";
import { useRouter } from "vue-router";
import getUser from "../composables/getUser";

export default {
  setup() {
    const { error, logout } = useLogout();
    const router = useRouter();
    const { user } = getUser();

    const handleLogout = async () => {
      await logout();
    };

    return {
      error,
      user,
      handleLogout,
    };
  },
};
</script>

<style>
.nav-item a {
  text-decoration: none;
  color: white;
  margin-right: 20px;
}

.nav-item a:active {
  border-bottom: 2px solid #444;
  padding-bottom: 4px;
}

.email {
  display: inline-block;
}
</style>
