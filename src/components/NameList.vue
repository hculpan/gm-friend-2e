<template>
  <div class="d-flex justify-content-center mt-2">
    <div class="container" style="width: 300px;">
      <div class="text-dark bg-light rounded" style="min-height: 300px">
        <div v-if="names.length == 0" class="text-muted text-italics">No names generated</div>
        <div v-for="name in names" :key="name.name">
          {{ name.name }} <span v-if="showType" class="text-muted">({{ name.type.substr(0, 1).toLowerCase() }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["names", "showType"],
};
</script>

<style></style>
