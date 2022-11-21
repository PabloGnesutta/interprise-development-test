<template>
  <div>
    <OptionButton
      v-for="(option, i) in options"
      :key="option"
      :text="option + suffix"
      :selected="selectedItems.includes(option)"
      :position="
        options.length === 1
          ? 'single'
          : i === 0
          ? 'left'
          : i < options.length - 1
          ? 'middle'
          : 'right'
      "
      @onClick="onClick(i)"
    />
  </div>
</template>

<script>
import OptionButton from "@/components/OptionButton";

export default {
  name: "ButtonsRow",
  components: { OptionButton },
  props: {
    options: { type: Array, default: () => [] },
    suffix: { type: String, default: "" },
    selectedItems: { type: Array, default: () => [] },
    multiple: { type: Boolean, default: false },
  },
  methods: {
    onClick(index) {
      if (this.multiple) this.$emit("toggle", index);
      else this.$emit("select", index);
    },
  },
};
</script>
