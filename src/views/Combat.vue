<template>
  <div class="error" v-if="error">
    <label>{{ error }}</label>
  </div>
  <div class="loading" v-if="!error && !monsters.length">
    <label>Loading data...</label>
  </div>
  <div v-if="!error && monsters.length">
    <div class="add-monsters">
      <div class="fight-actions">
        <label class="form-label ps-4">Monster</label>
        <router-link :to="{ name: 'Monster Search' }" class="text-light">
          <span class="material-icons search">
            search
          </span>
        </router-link>
        <select
          name="selectedMonster"
          id="selectedMonster"
          class="form-control me-2"
          v-model="selectedMonster"
          style="max-width: 10em;"
        >
          <option v-for="monster in monsters" :key="monster.id" :value="monster.id">
            {{ monster.name }}
          </option>
        </select>

        <!--<button class="btn btn-primary me-5" @click="addToFight">Add to Fight</button>-->
        <button class="btn btn-primary me-5" data-bs-target="#addToFightModal" data-bs-toggle="modal">
          Add to Fight
        </button>
        <button class="btn btn-primary me-2" @click="startFight" :disabled="fightInProgress">
          Start Fight
        </button>
        <button class="btn btn-primary me-2" @click="endFight" :disabled="!fightInProgress">End Fight</button>
        <button class="btn btn-primary me-2" @click="resetFight" :disabled="fightInProgress">
          Reset Fight
        </button>
      </div>

      <div class="creature-actions">
        <input
          type="number"
          min="0"
          max="9999"
          name="damageAmount"
          v-model="damageAmount"
          :disabled="!fightInProgress"
          class="form-control number-input me-2"
        />
        <button class="btn btn-primary me-2" @click="doDamage(1)" :disabled="!fightInProgress">
          Full Damage
        </button>
        <button class="btn btn-primary me-2" @click="doDamage(0.5)" :disabled="!fightInProgress">
          Half Damage
        </button>
        <button class="btn btn-primary me-5" @click="doDamage(-1)" :disabled="!fightInProgress">Heal</button>

        <label class="form-label ps-4 pe-2">Init Roll</label>
        <input
          type="number"
          min="1"
          max="10"
          name="baseInitiative"
          v-model="baseInitiative"
          :disabled="!fightInProgress"
          class="form-control number-input me-5"
          @change="initiativeChanged"
        />

        <input
          type="number"
          min="0"
          max="9999"
          name="baseInitiative"
          v-model="groupInit"
          :disabled="!fightInProgress"
          class="form-control number-input me-2"
          @change="initiativeChanged"
        />
        <button class="btn btn-primary me-1" @click="applyInit" :disabled="!fightInProgress">Init Mod</button>
        <a data-bs-toggle="offcanvas" href="#offcanvasExample-initmod" role="button" aria-controls="offcanvasExample"
          ><i class="bi bi-info-circle"></i
        ></a>
      </div>

      <div class="next-round container">
        <div class="row mt-2 vcenter">
          <button class="col btn btn-primary col-1 me-2" @click="showAll">{{ buttonText }}</button>
          <button class="btn btn-primary col-1" data-bs-target="#xpModal" data-bs-toggle="modal">XP</button>
          <div class="col-4" style="text-align: center; vertical-align: middle;">
            <label v-if="currentRound !== 0" class="form-label me-2">Current Round: {{ currentRound }}</label>
            <label v-else class="form-label me-2">Round not started</label>
            <button
              class="btn btn-primary col-2"
              @click="newRound"
              :disabled="!fightInProgress"
              style="min-width: 140px"
            >
              New Round
            </button>
          </div>
          <div class="col-3">
            <select
              name="action_taken"
              id="action_taken"
              v-model="actionTaken"
              :disabled="!fightInProgress"
              class="form-control me-2"
              style="max-width: 150px"
            >
              <option value="no_action"></option>
              <option value="full_attack">Full Attack</option>
              <option value="full_move">Full Move</option>
              <option value="move_attack">Move and Attack</option>
              <option value="charge">Charge</option>
              <option value="set-for-charge">Set for Charge</option>
              <option value="parry">Parrying</option>
              <option value="ready">Ready Attack</option>
              <option value="ready_no_attack">Ready Non-Attack</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="flee">Flee</option>
              <option value="spell">Cast a spell/spell-like ability</option>
              <option value="other">Other full-round action</option>
            </select>

            <button class="btn btn-primary" @click="setAction" :disabled="!fightInProgress">
              Action
            </button>
          </div>
          <div class="col">
            <button class="col btn btn-primary" @click="orderByInit">Order</button>
            <button class="col btn btn-primary ms-2" data-bs-target="#moraleModal" data-bs-toggle="modal">
              Morale
            </button>
            <a data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample"
              ><i class="bi bi-info-circle"></i
            ></a>
          </div>
        </div>
      </div>

      <div :key="forceRender" class="monster-list">
        <div v-for="monster in monstersToDisplay" :key="monster.uniqueId">
          <MonsterEntry
            :monster="monster"
            :fightInProgress="fightInProgress"
            @deleteMonster="deleteFromFight"
            @rerender="rerender"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- XP modal -->
  <div class="modal" id="xpModal">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header" style="text-align: center;">
          <h2 class="modal-title black-text">Encounter XP</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <XpDisplay :monsters="monstersInFight" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Morale modal -->
  <div class="modal" id="moraleModal" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <div class="h2 modal-title black-text">Morale Check</div>
          <div class="text-muted text-end" style="width: 500px"><em>Dungeon Master's Guide</em> pp. 97-99</div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <Morale :monsters="monstersInFight" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add to Fight modal -->
  <AddToFight :monster="findMonster(selectedMonster)" @to-add="(a) => addMonster(a)" />

  <!-- Reactions info sidebar -->
  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="offcanvasExample"
    aria-labelledby="offcanvasExampleLabel"
    style="width: 700px"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title text-dark" id="offcanvasExampleLabel">Morale Check Triggers</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body text-dark">
      <div class="row border-bottom mb-3">
        <label class="text-muted"><em>Dungeon Master's Guide</em> pp. 97-99</label>
      </div>
      <p class="text-start">The foes have been surprised, but only on the first round after surprise</p>
      <p class="text-start off-row">Faced by an obviously superior force</p>
      <p class="text-start">An ally is slain by magic</p>
      <p class="text-start off-row">25% of the group has fallen</p>
      <p class="text-start">50% of the group has fallen</p>
      <p class="text-start off-row">A companion is slain after more than 50% of the group has fallen</p>
      <p class="text-start">Their leader deserts or is slain</p>
      <p class="text-start off-row">Fighting a creature they cannot harm due to magical protections</p>
      <p class="text-start">Ordered to attempt a heroically dangerous task</p>
      <p class="text-start off-row">Offered temptation (bribe, chance to steal, etc.)</p>
      <p class="text-start">Told to act as a rear guard, such as covering a fighting withdrawal</p>
      <p class="text-start off-row">Directed to use up or use a charge from a personal powerful magical item</p>
      <p class="text-start">Given a chance to surrender (and have met the conditions for one other morale check)</p>
      <p class="text-start off-row">Completely surrounded</p>
    </div>
  </div>

  <!-- Init modifiers info sidebar -->
  <InitModifiers></InitModifiers>
</template>

<script>
import { ref, computed } from "vue";
import MonsterEntry from "../components/MonsterEntry";
import getMonsters from "../composables/getMonsters";
import { onMounted, onUnmounted } from "@vue/runtime-core";
import calcFinalInitiative from "../composables/calcFinalInitiative";
import Morale from "../components/Morale.vue";
import XpDisplay from "../components/XpDisplay.vue";
import InitModifiers from "../components/InitModifiers.vue";
import AddToFight from "../components/AddToFight.vue";

export default {
  name: "Home",
  components: { MonsterEntry, Morale, XpDisplay, InitModifiers, AddToFight },
  setup() {
    const selectedMonster = ref("");
    const monstersInFight = ref([]);
    const fightInProgress = ref(false);
    const showAllMonsters = ref(false);
    const forceRender = ref(0);
    const damageAmount = ref(0);
    const actionTaken = ref("no_action");
    const currentRound = ref(0);
    const baseInitiative = ref(1);
    const groupInit = ref(0);

    let uniqueId = 0;

    const rollMaxChanged = () => {
      localStorage.setItem("rollMax", rollMax.value);
    };

    const applyInit = () => {
      for (let i = 0; i < monstersInFight.value.length; i++) {
        let monster = monstersInFight.value[i];
        if (monster.selected) {
          monster.initModifier = groupInit.value;
          monster.finalInitiative = monster.initiative + monster.initModifier;
          monster.selected = false;
        }
      }
      rerender();
    };

    const orderByInit = () => {
      monstersInFight.value = monstersInFight.value.sort((m1, m2) => m1.finalInitiative - m2.finalInitiative);
      rerender();
    };

    const monstersToDisplay = computed(() => {
      return monstersInFight.value.filter((monster) => {
        return showAllMonsters.value || monster.inFight;
      });
    });

    const buttonText = computed(() => {
      if (showAllMonsters.value) {
        return "Hide";
      }
      return "Show";
    });

    const showAll = () => {
      showAllMonsters.value = !showAllMonsters.value;
    };

    const storeWindowState = () => {
      for (let i = 0; i < monstersInFight.value.length; i++) {
        monstersInFight.value[i].selected = false;
      }

      localStorage.setItem("monsterInFight", JSON.stringify(monstersInFight.value));
      localStorage.setItem("fightInProgress", fightInProgress.value.toString());
      localStorage.setItem("showAllMonsters", showAllMonsters.value.toString());
      localStorage.setItem("currentRound", currentRound.value.toString());
      localStorage.setItem("init", baseInitiative.value.toString());
    };

    onUnmounted(() => {
      storeWindowState();

      window.removeEventListener("beforeunload", storeWindowState);
    });

    const { monsters, error, load } = getMonsters();
    load();

    onMounted(() => {
      let data = localStorage.getItem("monsterInFight");
      if (data) {
        monstersInFight.value = JSON.parse(data);
      }

      fightInProgress.value = localStorage.getItem("fightInProgress") == "true";
      showAllMonsters.value = localStorage.getItem("showAllMonsters") == "true";
      data = parseInt(localStorage.getItem("currentRound"));
      if (data) {
        currentRound.value = data;
      }
      data = parseInt(localStorage.getItem("init"));
      if (data) {
        baseInitiative.value = data;
      }

      for (let i = 0; i < monstersInFight.value.length; i++) {
        monstersInFight.value[i].initiative = baseInitiative.value;
        monstersInFight.value[i].finalInitiative = calcFinalInitiative(monstersInFight.value[i]);
      }

      window.addEventListener("beforeunload", storeWindowState);

      data = sessionStorage.getItem("selectedMonster");
      if (data) {
        selectedMonster.value = data;
        sessionStorage.removeItem("selectedMonster");
      }
    });

    const newRound = () => {
      currentRound.value++;
      monstersInFight.value = monstersInFight.value.sort((m1, m2) => m1.uniqueId - m2.uniqueId);
      for (let i = 0; i < monstersInFight.value.length; i++) {
        let monster = monstersInFight.value[i];
        monster.action = "no_action";
        monster.selected = false;
        actionTaken.value = "no_action";
        baseInitiative.value = 1;
        rerender();
      }
    };

    const startFight = () => {
      fightInProgress.value = true;
      currentRound.value = 1;
    };

    const endFight = () => {
      fightInProgress.value = false;
      currentRound.value = 0;
    };

    const setAction = () => {
      for (let i = 0; i < monstersInFight.value.length; i++) {
        let monster = monstersInFight.value[i];
        if (monster.selected) {
          monster.action = actionTaken.value;
          monster.selected = false;
        }
      }
      rerender();
    };

    const doDamage = (multiplier) => {
      for (let i = 0; i < monstersInFight.value.length; i++) {
        let monster = monstersInFight.value[i];
        if (monster.selected) {
          monster.currentHitPoints -= Math.floor(damageAmount.value * multiplier);
          if (monster.currentHitPoints > monster.maxHitPoints) monster.currentHitPoints = monster.maxHitPoints;
          if (monster.currentHitPoints < 0) monster.currentHitPoints = 0;
          monster.selected = false;

          if (!monster.inFight && monster.currentHitPoints > 0) {
            monster.inFight = true;
          }

          rerender();
        }
      }
    };

    const rerender = () => {
      forceRender.value++;
    };

    const deleteFromFight = (id) => {
      let index = -1;
      for (let i = 0; i < monstersInFight.value.length; i++) {
        if (monstersInFight.value[i].uniqueId == id) {
          index = i;
          break;
        }
      }

      if (index > -1) {
        if (fightInProgress.value) {
          monstersInFight.value[index].inFight = !monstersInFight.value[index].inFight;
          monstersInFight.value[index].selected = false;
        } else {
          monstersInFight.value.splice(index, 1);
        }
      }

      rerender();
    };

    const initiativeChanged = () => {
      for (let i = 0; i < monstersInFight.value.length; i++) {
        if (monstersInFight.value[i].inFight) {
          monstersInFight.value[i].initiative = baseInitiative;
        }
      }
    };

    const findMonster = (id) => {
      for (let i = 0; i < monsters.value.length; i++) {
        if (monsters.value[i].id === id) {
          return { ...monsters.value[i] };
        }
      }

      return null;
    };

    const calculateNaturalInitModifier = (size) => {
      if (size.startsWith("S") || size.startsWith("M")) {
        return 3;
      } else if (size.startsWith("L")) {
        return 6;
      } else if (size.startsWith("H")) {
        return 9;
      } else if (size.startsWith("G")) {
        return 12;
      }

      return 0;
    };

    const getNextFightId = (name) => {
      let result = 0;

      for (let i = 0; i < monstersInFight.value.length; i++) {
        if (monstersInFight.value[i].name == name && monstersInFight.value[i].fightId > result) {
          result = monstersInFight.value[i].fightId;
        }
      }

      return result + 1;
    };

    const addMonster = (a) => {
      if (!a) return;

      let protoMonster = a.protoMonster;
      let parsedHitDice = parseHitDice(protoMonster.hit_dice);
      let count = a.count;
      let rollMax = a.rollMax;

      let nextId = getNextFightId(protoMonster.name);
      for (let i = 0; i < count; i++) {
        let hp = protoMonster.hit_points;
        if (!hp) {
          hp = rollHitDice(parsedHitDice, rollMax);
        }
        let monsterToAdd = {
          ...protoMonster,
          maxHitPoints: hp,
          currentHitPoints: hp,
          inFight: true,
          fightId: nextId++,
          uniqueId: uniqueId++,
          selected: false,
          action: "no_action",
          initiative: 0,
          initModifier: calculateNaturalInitModifier(protoMonster.size),
          finalInitiative: 0,
        };

        monstersInFight.value.push(monsterToAdd);
      }
    };

    const addToFight = () => {
      if (!selectedMonster.value) return;

      let protoMonster = findMonster(selectedMonster.value);
      let parsedHitDice = parseHitDice(protoMonster.hit_dice);

      let nextId = getNextFightId(protoMonster.id);
      for (let i = 0; i < count.value; i++) {
        let hp = rollHitDice(parsedHitDice, rollMax.value);
        let monsterToAdd = {
          ...protoMonster,
          maxHitPoints: hp,
          currentHitPoints: hp,
          inFight: true,
          fightId: nextId++,
          uniqueId: uniqueId++,
          selected: false,
          action: "no_action",
          initiative: 0,
          initModifier: calculateNaturalInitModifier(protoMonster.size),
          finalInitiative: 0,
        };

        monstersInFight.value.push(monsterToAdd);
      }
    };

    const resetFight = () => {
      monstersInFight.value = [];
    };

    return {
      monsters,
      selectedMonster,
      monstersInFight,
      error,
      fightInProgress,
      monstersToDisplay,
      showAllMonsters,
      buttonText,
      forceRender,
      damageAmount,
      actionTaken,
      currentRound,
      baseInitiative,
      groupInit,
      orderByInit,
      applyInit,
      initiativeChanged,
      addToFight,
      resetFight,
      deleteFromFight,
      showAll,
      rerender,
      doDamage,
      setAction,
      newRound,
      startFight,
      endFight,
      rollMaxChanged,
      findMonster,
      addMonster,
    };

    function parseHitDice(hitDice) {
      var result = {
        numDice: 0,
        modifier: 0,
      };

      if (hitDice.trim() === "1/4") {
        result.numDice = 0.25;
      } else if (hitDice.trim() === "1/2") {
        result.numDice = 0.5;
      } else if (hitDice.indexOf("+") > -1) {
        var str = hitDice.split("+");
        result.numDice = parseInt(str[0]);
        result.modifier = parseInt(str[1]);
      } else if (hitDice.indexOf("-") > -1) {
        var str = hitDice.split("-");
        result.numDice = parseInt(str[0]);
        result.modifier = parseInt(str[1]) * -1;
      } else {
        result.numDice = parseInt(hitDice);
      }

      return result;
    }

    function rollHitDice(dice, rollMaxAtFirst) {
      var hp = 1;
      if (dice.numDice < 1) {
        if (rollMaxAtFirst) {
          hp = Math.floor(dice.numDice * 8) + dice.modifier;
        } else {
          hp = Math.floor((Math.random() * 8 + 1) * dice.numDice) + dice.modifier;
        }
      } else {
        hp = rollBaseHitDice(dice.numDice, rollMaxAtFirst) + dice.modifier;
      }

      return hp < 1 ? 1 : hp;
    }

    function rollBaseHitDice(count, rollMaxAtFirst) {
      var result = 0;
      for (var i = 0; i < count; i++) {
        if (i == 0 && rollMaxAtFirst) result += 8;
        else result += Math.floor(Math.random() * 8 + 1);
      }
      return result;
    }
  },
};
</script>

<style scoped>
.black-text {
  color: black;
}

.vcenter {
  display: flex;
  align-items: center;
}

.form-control {
  max-height: 35px;
  display: inline-block;
  max-width: 200px;
}

.next-round,
.fight-actions,
.add-monsters {
  margin-bottom: 10px;
}

button:enabled {
  cursor: pointer;
}

button:disabled {
  cursor: default;
  background: #555;
  color: #888;
}

.number-input {
  max-width: 100px;
}

.off-row {
  background: lightgray;
}

.search {
  vertical-align: middle;
}
</style>
