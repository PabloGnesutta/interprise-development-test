<template>
  <div id="app" class="text-black">
    <div class="flex items-center justify-center">
      <div class="container">
        <!-- Note: This could be a router view in the future 
        I've made it a simple component for simplicity -->
        <DataView />
      </div>
    </div>
  </div>
</template>

<script>
import DataView from "./views/DataView";
export default {
  name: "App",
  components: { DataView },
};
</script>

<style scoped>
.container {
  width: 95%;
  max-width: 900px;
}
</style>
