<template>
  <div>
    <div class="buttons">
      <ButtonsRow
        :options="currencyOptions"
        :selectedItems="[currentCurrency]"
        @select="selectCurrency"
      />
      <ButtonsRow
        :multiple="true"
        :options="yearsOptions"
        :selectedItems="currentYears"
        suffix=" YRS"
        class="min-w-custom"
        @toggle="toggleYears"
      />
      <ButtonsRow
        :options="displayOptions"
        :selectedItems="[currentDisplay]"
        @select="selectDisplay"
      />
    </div>

    <TextInput
      placeholder="Filter by company name ..."
      @onInput="debounceFilter"
    />

    <CustomTable
      v-if="!loading"
      :data-set="filteredDataset"
      :currency="currentCurrency"
      :years="currentYears"
      :display="currentDisplay"
      :display-options="displayOptions"
      :secondary-rows="secondaryDisplayOptions"
    />
  </div>
</template>

<script>
import data from "../data/data.json";
import ButtonsRow from "@/components/ButtonsRow";
import TextInput from "@/components/TextInput";
import CustomTable from "@/components/CustomTable";

export default {
  name: "DataView",
  components: { ButtonsRow, TextInput, CustomTable },
  data() {
    return {
      loading: true,
      dataset: data.Items,
      filteredDataset: data.Items,
      debounceInterval: 250,
      debounceTimeOut: null,

      currencyYears: {},

      currencyOptions: [],
      currentCurrency: "",

      yearsOptions: [],
      currentYears: [],

      displayOptions: ["Spread", "Yield", "3MLSpread"],
      currentDisplay: "",
    };
  },

  computed: {
    secondaryDisplayOptions() {
      return this.displayOptions.filter((opt) => opt !== this.currentDisplay);
    },
  },

  mounted() {
    this.dataset.forEach((item) => {
      item.Quote?.forEach((q) => {
        if (!this.currencyYears[q.Currency]) {
          this.currencyYears[q.Currency] = [];
          this.currencyOptions.push(q.Currency);
        }
        if (!this.currencyYears[q.Currency].includes(q.Years)) {
          this.currencyYears[q.Currency].push(q.Years);
        }
      });
    });

    this.selectCurrency(0);
    this.loading = false;
  },

  methods: {
    selectCurrency(idx) {
      this.currentCurrency = this.currencyOptions[idx];
      this.yearsOptions = this.currencyYears[this.currentCurrency];
      this.currentYears = [...this.yearsOptions];
      this.selectDisplay(0);
    },
    selectDisplay(idx) {
      this.currentDisplay = this.displayOptions[idx];
    },
    toggleYears(idx) {
      const years = this.yearsOptions[idx];
      const selectedIndex = this.currentYears.findIndex((i) => i == years);
      if (selectedIndex !== -1) this.currentYears.splice(selectedIndex, 1);
      else {
        const sorted = [...this.currentYears, years].sort((a, b) =>
          a > b ? 1 : -1
        );
        this.currentYears = sorted;
      }
    },

    // Do the filtering after the user STOPS typing
    // to avoid performance overhead
    // delay time can be adjusted: this.debounceInterval
    debounceFilter(val) {
      clearTimeout(this.debounceTimeOut);
      this.debounceTimeOut = setTimeout(() => {
        this.filter(val);
      }, this.debounceInterval);
    },

    filter(_val) {
      const val = _val.toLowerCase();
      this.filteredDataset = this.dataset.filter((item) =>
        item.Company.toLowerCase().includes(val)
      );
    },
  },
};
</script>

<style scoped>
.buttons {
  @apply flex items-center gap-8 my-6;
}
.min-w-custom {
  min-width: 172px;
}
</style>
