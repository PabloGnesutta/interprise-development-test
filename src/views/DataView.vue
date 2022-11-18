<template>
  <div>
    <div class="flex items-center gap-8 my-6">
      <ButtonsRow :options="currencyOpts" @select="setCurrency" />
      <ButtonsRow :options="yearsOpts" :multiple="true" @toggle="toggleYears" />
      <ButtonsRow :options="displayOpts" @select="setDisplay" />
    </div>
    <TextInput
      placeholder="Filter by company name ..."
      @onInput="debounceFilter"
    />
    <div>
      <CustomTable
        :data-set="filteredDataset"
        :years="yearsValues"
        :display-options="displayOpts.map((i) => i.val)"
        :display="displayOpts[displayIdx].val"
        :currency="currencyOpts[currencyIdx].val"
      />
    </div>
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
      dataset: data.Items,
      filteredDataset: data.Items,
      debounceInterval: 250,
      debounceTimeOut: null,
      currencyOpts: [
        { val: "USD", selected: true },
        { val: "EUR", selected: false },
        { val: "CAD", selected: false },
      ],
      currencyIdx: 0,

      displayOpts: [
        { val: "Spread", selected: true },
        { val: "Yield", selected: false },
        { val: "3MLSpread", selected: false },
      ],
      displayIdx: 0,

      yearsOpts: [
        { val: 5, label: "5a YRS", selected: true },
        { val: 10, label: "10 YRS", selected: true },
        { val: 40, label: "40 YRS", selected: true },
      ],
      yearsIdxs: [0, 1, 2],
      yearsValues: [5, 10, 40],
    };
  },

  methods: {
    setCurrency(index) {
      this.currencyOpts[this.currencyIdx].selected = false;
      this.currencyIdx = index;
      this.currencyOpts[this.currencyIdx].selected = true;
    },
    setDisplay(index) {
      this.displayOpts[this.displayIdx].selected = false;
      this.displayIdx = index;
      this.displayOpts[this.displayIdx].selected = true;
    },
    toggleYears(index) {
      const isSelectedIndex = this.yearsIdxs.findIndex((i) => i == index);
      if (isSelectedIndex !== -1) {
        this.yearsIdxs.splice(isSelectedIndex, 1);
      } else {
        this.yearsIdxs.push(index);
      }
      this.yearsOpts[index].selected = !this.yearsOpts[index].selected;
      this.yearsIdxs.sort((a, b) => (a > b ? 1 : -1));
      this.yearsValues = this.yearsIdxs.map((i) => this.yearsOpts[i].val);
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
