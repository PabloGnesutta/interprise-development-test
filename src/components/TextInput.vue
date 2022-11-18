<template>
  <div>
    <input
      :value="val"
      type="text"
      :placeholder="placeholder"
      @input="onInput"
    />
  </div>
</template>

<script>
export default {
  name: "TextInput",
  props: {
    placeholder: { type: String, default: "Placeholder" },
  },
  data() {
    return {
      val: "",
    };
  },
  methods: {
    onInput({ target }) {
      this.val = target.value;
      this.$emit("onInput", this.val);
    },
  },
};
</script>

<style scoped>
input {
  @apply border border-2 border-grayLight rounded-md text-sm px-3 py-1 text-black outline-none;
  transition: border-color 200ms ease-out;
  min-width: 33%;
}
input:focus {
  @apply border-primary;
}
</style>
