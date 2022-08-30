<template>
  <div class="modal text-dark" id="encounterManagerModal" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <div class="h2 modal-title">Encounter Manager</div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="row" v-for="encounter in encounters" v-bind:key="encounter">
              <div class="col-4"></div>
              <div class="form-check text-start col">
                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault"
                  :value="encounter"
                  v-model="selectedEncounter"
                />
                <label class="form-check-label text-start" for="flexRadioDefault">
                  {{ encounter }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            style="width: 100px"
            @click="loadClicked"
          >
            Load
          </button>
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            style="width: 100px"
            @click="deleteClicked"
          >
            Delete
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
import { onMounted, ref } from "vue";

const encounters = ref([]);
const selectedEncounter = ref("");

const loadClicked = () => {
  console.log(selectedEncounter.value);
};

onMounted(() => {
  for (var key in localStorage) {
    if (key.startsWith("encounter-")) {
      const [first, ...rest] = key.split("-");
      encounters.value.push(rest.join("-"));
    }
  }
});
</script>
