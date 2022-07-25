<template>
  <div>
    <div v-if="!monster" class="d-flex justify-content-between">
      <div class="h5 ps-3 text-muted text-italic"><em>No monster selected</em></div>
      <div class="material-icons search" @click="addMonster">
        add
      </div>
    </div>
    <div v-else class="ps-3">
      <div class="d-flex justify-content-between">
        <div class="h4 text-primary">
          {{ monster.name }}
        </div>
        <div>
          <div class="material-icons search" @click="editMonster">
            edit
          </div>
          <div class="material-icons search">
            remove
          </div>
          <div class="material-icons search" @click="addMonster">
            add
          </div>
        </div>
      </div>

      <table class="text-dark" style="width: 100%">
        <colgroup>
          <col span="1" style="width: 35%" />
          <col span="1" style="width: 45%" />
          <col span="1" style="width: 20%" />
        </colgroup>
        <tr>
          <td>Creature Type:</td>
          <td>{{ monster.type }}</td>
        </tr>
        <tr>
          <td>Climate/Terrain:</td>
          <td>{{ monster.terrain }}</td>
        </tr>
        <tr>
          <td>Frequency:</td>
          <td>{{ monster.frequency }}</td>
        </tr>
        <tr>
          <td>Organization:</td>
          <td>{{ monster.organization }}</td>
        </tr>
        <tr>
          <td>Activity Cyle:</td>
          <td>{{ monster.activity }}</td>
        </tr>
        <tr>
          <td>Diet:</td>
          <td>{{ monster.diet }}</td>
        </tr>
        <tr>
          <td>Intelligence:</td>
          <td>{{ monster.intelligence }}</td>
        </tr>
        <tr>
          <td>Treasure:</td>
          <td>{{ monster.treasure_type }}</td>
        </tr>
        <tr>
          <td>Alignment:</td>
          <td>{{ monster.alignment }}</td>
        </tr>
      </table>

      <hr class="p-0 m-0 my-1" />
      <table class="text-dark" style="width: 100%">
        <colgroup>
          <col span="1" style="width: 35%" />
          <col span="1" style="width: 45%" />
          <col span="1" style="width: 20%" />
        </colgroup>
        <tr>
          <td>No. Appearing:</td>
          <td>{{ monster.no_appearing }}</td>
        </tr>
        <tr>
          <td>Armor Class:</td>
          <td>{{ monster.ac }} [{{ recalcAc(monster.ac) }}]</td>
        </tr>
        <tr>
          <td>Movement:</td>
          <td>{{ monster.movement }}</td>
        </tr>
        <tr>
          <td>Hit Dice:</td>
          <td>{{ monster.hit_dice }}</td>
        </tr>
        <tr>
          <td>THAC0:</td>
          <td>{{ monster.thac0 }} [{{ recalcThac0(monster.thac0) }}]</td>
        </tr>
        <tr>
          <td>No. of Attacks:</td>
          <td>{{ monster.no_attacks }}</td>
        </tr>
        <tr>
          <td>Damage/Attack:</td>
          <td>{{ monster.damage }}</td>
        </tr>
        <tr>
          <td>Special Attacks:</td>
          <td>{{ monster.special_attacks }}</td>
        </tr>
        <tr>
          <td>Special Defenses:</td>
          <td>{{ monster.special_defense }}</td>
        </tr>
        <tr>
          <td>Magic Resistance:</td>
          <td>{{ monster.magic_resistance }}</td>
        </tr>
        <tr>
          <td>Size:</td>
          <td>{{ monster.size }}</td>
        </tr>
        <tr>
          <td>Morale:</td>
          <td>{{ monster.morale }}</td>
        </tr>
        <tr>
          <td>XP:</td>
          <td>{{ monster.xp }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { recalcAc, recalcThac0 } from "../composables/recalcStats";
import { useRouter } from "vue-router";

export default {
  props: ["monster"],
  setup(props) {
    const router = useRouter();

    const addMonster = () => {
      router.push({ name: "AddMonster" });
    };

    const editMonster = () => {
      router.push({ name: "EditMonster", params: { monsterId: props.monster.id } });
    };

    return {
      recalcAc,
      recalcThac0,
      addMonster,
      editMonster,
    };
  },
};
</script>

<style></style>
