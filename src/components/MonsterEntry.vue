<template>
  <div
    class="monster"
    ref="monsterDiv"
    :class="{ dead: monster.currentHitPoints <= 0 || !monster.inFight }"
    @click="toggleSelected"
  >
    <div class="basic-data">
      <div class="actions" v-if="fightInProgress">
        <span class="material-icons" @click="deleteFromFight">
          trending_down
        </span>
      </div>
      <div class="actions" v-else>
        <span class="material-icons" @click="deleteFromFight">
          delete_forever
        </span>
      </div>
      <div class="init">{{ monster.finalInitiative }}</div>
      <div class="h3" @click="toggleShowData">{{ monster.name }} ({{ monster.fightId }})</div>
      <div class="hp">HP: {{ monster.currentHitPoints }} / {{ monster.maxHitPoints }}</div>
      <div class="toHit">To Hit: +{{ calculateToHit(monster.thac0) }}</div>
      <div class="ac">AC: {{ calculateAscAC(monster.ac) }}</div>

      <select name="action_taken" id="action_taken" @click="noEvent" v-model="monster.action">
        <option value="no_action"></option>
        <option value="full_attack">Full Attack</option>
        <option value="full_move">Full Move</option>
        <option value="move_attack">Move and Attack</option>
        <option value="charge">Charge</option>
        <option value="parry">Parrying</option>
        <option value="ready">Ready Attack</option>
        <option value="ready_no_attack">Ready Non-Attack</option>
        <option value="withdrawal">Withdrawal</option>
        <option value="flee">Flee</option>
        <option value="spell">Cast a spell/spell-like ability</option>
        <option value="other">Other full-round action</option>
      </select>

      <input
        type="number"
        min="-100"
        max="100"
        name="initModifier"
        class="form-control number-input"
        v-model="monster.initModifier"
        @change="rerender"
        @click="noEvent"
      />
    </div>

    <div v-if="showData" class="extra-data">
      <p>
        HD {{ monster.hit_dice }}, Original AC: {{ monster.ac }}, MV:
        {{ monster.movement }}
      </p>
      <p>
        THAC0: {{ monster.thac0 }}, Attacks: {{ monster.no_attacks }}, Damage: {{ monster.damage }}, Special Attacks:
        {{ monster.special_attacks }}, Special Defenses: {{ monster.special_defense }}
      </p>
      <p>Size: {{ monster.size }}, Morale: {{ monster.morale }}, XP: {{ monster.xp }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { watchEffect } from "@vue/runtime-core";
import calcFinalInitiative from "../composables/calcFinalInitiative";

export default {
  props: ["monster", "fightInProgress"],
  setup(props, context) {
    const showData = ref(false);
    const monsterDiv = ref(null);

    const deleteFromFight = () => {
      context.emit("deleteMonster", props.monster.uniqueId);
    };

    const rerender = () => {
      context.emit("rerender");
    };

    const noEvent = (event) => {
      event.stopPropagation();
    };

    const toggleShowData = (event) => {
      showData.value = !showData.value;
      event.stopPropagation();
    };

    const calculateAscAC = (dac) => {
      let num = dac.match(/^[^\d]*(\d+)/)[0];
      if (num) return 20 - num;
      else return 10;
    };

    const calculateToHit = (thac0) => {
      let num = thac0.match(/^[^\d]*(\d+)/)[0];
      if (num) return 20 - num;
      else return 10;
    };

    watchEffect(() => {
      if (monsterDiv.value && props.monster.currentHitPoints <= 0 && props.monster.inFight) {
        monsterDiv.value.classList.add("dying");
        setTimeout(() => {
          if (monsterDiv.value) monsterDiv.value.classList.remove("dying");
          props.monster.inFight = false;
          props.monster.select = false;
        }, 1500);
      }

      props.monster.finalInitiative = calcFinalInitiative(props.monster);
    });

    const toggleSelected = () => {
      if (!monsterDiv.value) return;

      if (!props.monster.selected) {
        monsterDiv.value.classList.add("selected");
        props.monster.selected = true;
      } else {
        monsterDiv.value.classList.remove("selected");
        props.monster.selected = false;
      }
    };

    return {
      showData,
      monsterDiv,
      deleteFromFight,
      toggleSelected,
      toggleShowData,
      noEvent,
      rerender,
      calculateAscAC,
      calculateToHit,
    };
  },
};
</script>

<style scoped>
.monster {
  margin: 5px auto;
  background: white;
  padding: 0 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.5);
  border-left: 8px solid green;
  color: #666;
}

.selected {
  background: #666;
  color: white;
}

.dead {
  border-left: 8px solid red;
}

.dying {
  background: red;
  color: white;
}

p {
  margin: 5px;
}

.basic-data {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.h3 {
  display: inline;
  cursor: pointer;
}

.material-icons {
  font-size: 24px;
  color: #bbb;
  cursor: pointer;
}

.material-icons:hover {
  color: #777;
}

.number-input {
  max-width: 100px;
}
</style>
