<template>
  <div class="modal" id="addToFightModal" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <div class="h2 modal-title text-dark">Add to Fight</div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container text-dark">
            <div class="row mb-1">
              <div class="col-3 text-end me-2">
                How many?
              </div>
              <input
                type="number"
                name="count"
                id="count"
                min="1"
                max="100"
                style="width: 100px; height: 30px"
                class="col-4 rounded border-1"
                v-model="count"
              />
            </div>
            <div class="row mb-1">
              <div class="col-3 text-end">Max HP</div>
              <input
                class="col-4 rounded border-1"
                type="checkbox"
                id="flexSwitchCheckDefault"
                style="width: 50px; height: 30px"
                v-model="rollMax"
                @change="rollMaxChanged"
              />
            </div>
            <div class="row mb-1">
              <div class="col-3 text-end me-2">Name</div>
              <input
                class="col-4 rounded border-1"
                type="text"
                name="monsterName"
                id="monsterName"
                v-model="monster.name"
              />
            </div>
            <div class="row mb-1">
              <div class="col-3 text-end me-2">Armor Class</div>
              <input
                class="col-4 rounded border-1"
                type="text"
                name="monsterName"
                id="monsterName"
                v-model="monster.ac"
              />
              <div class="col-3 rounded border-1 text-start" type="text" name="monsterName" id="monsterName">
                {{ recalcAc(monster.ac) }}
              </div>
            </div>
            <div class="row mb-1">
              <div class="col-3 text-end me-2">Movement</div>
              <input
                class="col-4 rounded border-1"
                type="text"
                name="monsterName"
                id="monsterName"
                v-model="monster.movement"
              />
            </div>
            <div class="row mb-1">
              <div class="col-3 text-end me-2">Hit Dice</div>
              <input
                class="col-4 rounded border-1"
                type="text"
                name="monsterName"
                id="monsterName"
                v-model="monster.hit_dice"
              />
            </div>
            <div class="row mb-1">
              <div class="col-3 text-end me-2">Hit Points</div>
              <input
                class="col-4 rounded border-1"
                type="text"
                name="monsterName"
                id="monsterName"
                v-model="monster.hit_points"
              />
            </div>
            <div class="row mb-1">
              <div class="col-3 text-end me-2">THAC0</div>
              <input
                class="col-4 rounded border-1"
                type="text"
                name="monsterName"
                id="monsterName"
                v-model="monster.thac0"
              />
              <div class="col-3 rounded border-1 text-start" type="text" name="monsterName" id="monsterName">
                {{ recalcThac0(monster.thac0) }}
              </div>
            </div>
            <div class="row mb-1">
              <div class="col-3 text-end me-2">No. of Attacks</div>
              <input
                class="col-4 rounded border-1"
                type="text"
                name="monsterName"
                id="monsterName"
                v-model="monster.no_attacks"
              />
            </div>
            <div class="row mb-1">
              <div class="col-3 text-end me-2">Damage/Attack</div>
              <input
                class="col-4 rounded border-1"
                type="text"
                name="monsterName"
                id="monsterName"
                v-model="monster.damage"
              />
            </div>
            <div class="row mb-1">
              <div class="col-3 text-end me-2">Special Attacks</div>
              <input
                class="col-4 rounded border-1"
                type="text"
                name="monsterName"
                id="monsterName"
                v-model="monster.special_attacks"
              />
            </div>
            <div class="row mb-1">
              <div class="col-3 text-end me-2">Special Defenses</div>
              <input
                class="col-4 rounded border-1"
                type="text"
                name="monsterName"
                id="monsterName"
                v-model="monster.special_defenses"
              />
            </div>
            <div class="row mb-1">
              <div class="col-3 text-end me-2">Magic Resistance</div>
              <input
                class="col-4 rounded border-1"
                type="text"
                name="monsterName"
                id="monsterName"
                v-model="monster.magic_resistance"
              />
            </div>
            <div class="row mb-1">
              <div class="col-3 text-end me-2">Size</div>
              <input
                class="col-4 rounded border-1"
                type="text"
                name="monsterName"
                id="monsterName"
                v-model="monster.size"
              />
            </div>
            <div class="row mb-1">
              <div class="col-3 text-end me-2">Morale</div>
              <input
                class="col-4 rounded border-1"
                type="text"
                name="monsterName"
                id="monsterName"
                v-model="monster.morale"
              />
            </div>
            <div class="row mb-1">
              <div class="col-3 text-end me-2">XP</div>
              <input
                class="col-4 rounded border-1"
                type="text"
                name="monsterName"
                id="monsterName"
                v-model="monster.xp"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" style="width: 100px" @click="okClicked">
            Ok
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            style="width: 100px"
            @click="cancelClicked"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { onMounted } from "@vue/runtime-core";
import { recalcAc, recalcThac0 } from "../composables/recalcStats";
import { ok } from "assert";

const props = defineProps({
  monster: Object,
});

const emit = defineEmits(["to-add"]);

const count = ref(1);
const rollMax = ref(true);
const monster = ref({});

watch(props, (currentValue, oldValue) => {
  monster.value = currentValue.monster;
});

const okClicked = () => {
  console.log("ok hit");
  let a = {
    count: count.value,
    maxHp: rollMax.value,
    protoMonster: monster.value,
  };
  emit("to-add", a);
};

const cancelClicked = () => {
  console.log("cancel hit");
};

const rollMaxChanged = () => {
  localStorage.setItem("rollMax", rollMax.value);
};

onMounted(() => {
  let data = localStorage.getItem("rollMax");
  if (data) {
    rollMax.value = data === "true";
  } else {
    rollMax.value = true;
  }
});
</script>
