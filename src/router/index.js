import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import AddMonster from "../views/AddMonster";
import EditMonster from "../views/EditMonster";
import Login from "../views/Login";
import NameGenerator from "../views/NameGenerator";
import MonsterSearch from "../views/MonsterSearch";
import Reaction from "../views/Reaction";
import TreasureGenerator from "../views/TreasureGenerator";
import Combat from "../views/Combat";
import Npcs from "../views/npcs/Npcs";
import NpcsAdd from "../views/npcs/NpcsAdd";
import NpcsEdit from "../views/npcs/NpcsEdit";
import { auth } from "../firebase/config";

const requiredAuth = (to, from, next) => {
  let user = auth.currentUser;
  if (!user) {
    next({ name: "Login" });
  } else {
    next();
  }
};

const requiredNoAuth = (to, from, next) => {
  let user = auth.currentUser;
  if (user) {
    next({ name: "Home" });
  } else {
    next();
  }
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: requiredAuth,
  },
  {
    path: "/combat",
    name: "Combat",
    component: Combat,
    beforeEnter: requiredAuth,
  },
  {
    path: "/addmonster",
    name: "AddMonster",
    component: AddMonster,
    beforeEnter: requiredAuth,
  },
  {
    path: "/editmonster",
    name: "EditMonster",
    component: EditMonster,
    props: true,
    beforeEnter: requiredAuth,
  },
  {
    path: "/name-generator",
    name: "Names",
    component: NameGenerator,
    beforeEnter: requiredAuth,
  },
  {
    path: "/monster-search",
    name: "Monster Search",
    component: MonsterSearch,
    beforeEnter: requiredAuth,
  },
  {
    path: "/reaction",
    name: "Reaction Check",
    component: Reaction,
    beforeEnter: requiredAuth,
  },
  {
    path: "/treasure",
    name: "Treasure",
    component: TreasureGenerator,
    beforeEnter: requiredAuth,
  },
  {
    path: "/npcs",
    name: "NPCs",
    component: Npcs,
    beforeEnter: requiredAuth,
  },
  {
    path: "/addnpc",
    name: "Add NPC",
    component: NpcsAdd,
    beforeEnter: requiredAuth,
  },
  {
    path: "/editnpc",
    name: "Edit NPC",
    component: NpcsEdit,
    props: true,
    beforeEnter: requiredAuth,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: requiredNoAuth,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
