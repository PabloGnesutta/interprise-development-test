<template>
  <div class="currency">
    <OptionButton
      v-for="(option, i) in options"
      :key="option.val"
      :text="option.label || option.val"
      :selected="option.selected"
      :position="i === 0 ? 'left' : i < options.length - 1 ? 'middle' : 'right'"
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
