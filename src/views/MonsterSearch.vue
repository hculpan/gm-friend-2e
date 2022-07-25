<template>
  <section id="monster-search">
    <div class="d-flex justify-content-around">
      <div class="mb-2">
        <label class="me-2">Name</label>
        <input type="text" style="width: 250px" placeholder="name" v-model="monsterName" />
      </div>
      <div class="mb-2">
        <label class="me-2">Terrain</label>
        <select name="terrains" id="terrains" v-model="selectedTerrain" style="max-width: 150px">
          <option value=""></option>
          <option :value="t" v-for="t in terrains" :key="t">{{ t }}</option>
        </select>
      </div>
    </div>
    <div class="d-flex justify-content-around mb-4">
      <div>
        <label class="me-2">Hit Dice</label>
        <input type="number" min="0" max="500" style="width: 70px" placeholder="min" v-model="hitDiceMin" />
        <label class="mx-2">to</label>
        <input type="number" min="0" max="500" style="width: 70px" placeholder="max" v-model="hitDiceMax" />
      </div>
      <div class="mb-2">
        <label class="me-2">Type</label>
        <select name="monsterType" id="monsterType" v-model="selectedType" style="max-width: 150px">
          <option value=""></option>
          <option :value="m" v-for="m in monsterTypes" :key="m">{{ m }}</option>
        </select>
      </div>
      <div>
        <label class="me-2">Alignment</label>
        <select name="alignment" id="alignment" v-model="selectedAlignment" style="max-width: 150px">
          <option value=""></option>
          <option value="LE">Lawful Evil</option>
          <option value="CE">Chaotic Evil</option>
          <option value="NE">Neutral Evil</option>
          <option value="N">True Neutral</option>
          <option value="LG">Lawful Good</option>
          <option value="CG">Chaotic Good</option>
          <option value="NG">Neutral Good</option>
          <option value="E">Any Evil</option>
          <option value="G">Any Good</option>
          <option value="C">Any Chaotic</option>
          <option value="L">Any Lawful</option>
          <option value="N">Any Neutral</option>
        </select>
      </div>
    </div>

    <div class="d-flex justify-content-center">
      <div>
        <button class="btn btn-danger" @click="reset"><span class="material-icons">restart_alt</span>Reset</button>
        <div class="monster-list bg-light text-dark rounded mt-4 text-start py-2">
          <div v-if="filteredMonsters.length == 0" class="text-muted ms-3"><em>No monsters found</em></div>
          <div class="list-group">
            <div v-for="m in filteredMonsters" :key="m.id" class="mx-3 list-group-item border-0 my-0 py-1">
              <a
                href="#"
                @click="selectedMonster = m"
                class="list-group-item list-group-item-action border-0 p-0 ps-2"
                :class="{ 'active rounded': selectedMonster && selectedMonster.id === m.id }"
              >
                {{ m.name }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button class="btn btn-primary" :disabled="!selectedMonster" @click="sendMessage">Select Monster</button>
        <div class="monster-list bg-light text-dark rounded mt-4 text-start py-2 ms-3" style="height: 630px">
          <MonsterDetails :monster="selectedMonster" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import getMonsters from "../composables/getMonsters";
import MonsterDetails from "../components/MonsterDetails.vue";

import terrains from "../data/terrains.json";
import monsterTypes from "../data/monstertypes.json";

export default {
  components: { MonsterDetails },
  setup() {
    const router = useRouter();
    const hitDiceMin = ref(null);
    const hitDiceMax = ref(null);
    const selectedTerrain = ref(null);
    const selectedAlignment = ref(null);
    const monsterName = ref(null);
    const selectedMonster = ref(null);
    const selectedType = ref(null);

    const { monsters, error, load } = getMonsters();
    load();

    const reset = () => {
      hitDiceMin.value = null;
      hitDiceMax.value = null;
      selectedMonster.value = null;
      selectedTerrain.value = null;
      selectedAlignment.value = null;
      monsterName.value = null;
      selectedType.value = null;
    };

    const sendMessage = () => {
      if (!selectedMonster.value) return;

      sessionStorage.setItem("selectedMonster", selectedMonster.value.id);
      router.push({ name: "Combat" });
    };

    const filteredMonsters = computed(() => {
      return monsters.value.filter((m) => {
        if (monsterName.value && !m.name.toLowerCase().includes(monsterName.value.toLowerCase())) return false;
        if (hitDiceMin.value && hitDie(m.hit_dice) < hitDiceMin.value) return false;
        if (hitDiceMax.value && hitDie(m.hit_dice) > hitDiceMax.value) return false;
        if (selectedTerrain.value && !m.terrain.includes(selectedTerrain.value)) return false;
        if (selectedAlignment.value && !m.alignment.includes(selectedAlignment.value)) return false;
        if (selectedType.value && m.type !== selectedType.value) return false;

        return true;
      });
    });

    const hitDie = (hitDice) => {
      try {
        return parseInt(hitDice.match(/^[^\d]*(\d+)/)[0]);
      } catch (err) {
        return 99;
      }
    };

    return {
      sendMessage,
      hitDiceMin,
      hitDiceMax,
      terrains,
      monsterTypes,
      selectedAlignment,
      selectedTerrain,
      selectedType,
      monsterName,
      monsters,
      filteredMonsters,
      selectedMonster,
      reset,
    };
  },
};
</script>

<style scoped>
.material-icons {
  vertical-align: middle;
}

.list-group {
  max-height: 620px;
  overflow: scroll;
}

.monster-list {
  width: 600px;
  height: 620px;
}

.monster-list-filtered {
  list-style: none;
  padding: 0;
}
</style>
