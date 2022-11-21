<template>
  <div class="inline-block">
    <button
      class="text-primary border border-primary text-xs p-2"
      :class="[selected && 'selected', position]"
      @click="$emit('onClick')"
    >
      {{ text }}
    </button>
  </div>
</template>

<script>
export default {
  name: "OptionButton",
  props: {
    text: { type: [String, Number], default: "option" },
    selected: { type: Boolean, default: false },
    position: { type: String, default: "middle" },
  },
};
</script>

<style lang="scss" scoped>
button.selected {
  @apply bg-primary text-white;
}
button.single {
  border-radius: 6px;
}
button.middle {
  border-left-color: transparent;
  border-right-color: transparent;
}
button.left {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}
button.right {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}
</style>
