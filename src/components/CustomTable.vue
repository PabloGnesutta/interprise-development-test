<template>
  <div class="text-sm">
    <!-- Table Header -->
    <div class="grid grid-cols-12 border-b border-black text-grayLight">
      <div class="col-span-2 flex items-end">
        <div class="sorting-column" @click="sortBy('DateSent')">
          <span class="ml-4"> DATE SENT </span>
          <Carret
            :class="{
              'rotate-180': sortStatus.DateSent === 1,
              'text-black': currentSortBy === 'DateSent',
            }"
          />
        </div>
      </div>
      <div class="col-span-4 flex items-end">
        <div class="sorting-column" @click="sortBy('Company')">
          <span> COMPANY </span>
          <Carret
            :class="{
              'rotate-180': sortStatus.Company === 1,
              'text-black': currentSortBy === 'Company',
            }"
          />
        </div>
      </div>
      <div
        v-for="year in years"
        :key="year"
        class="text-center"
        :class="`col-span-${yearsColSpan}`"
      >
        <div class="text-black font-bold border-b border-grayLight mr-1">
          {{ year }} YRS
        </div>
        <div class="grid grid-cols-2">
          <span>FIX</span>
          <span>FRN</span>
        </div>
      </div>
    </div>

    <!-- Table Body -->
    <div>
      <div v-for="item in orderedDataset" :key="item.Id" class="row-line">
        <!-- Main row: selected display -->
        <div class="row-inner grid grid-cols-12 border-b border-grayLight row">
          <div
            class="col-span-2 flex items-center gap-2 cursor-pointer select-none hover:text-primary"
            @click="toggleExpanded(item.Id)"
          >
            <span v-if="item.Quote">
              <Chevron
                :class="{ 'rotate-90': expandedItemIds.includes(item.Id) }"
              />
            </span>
            <span>{{ formatDate(item.DateSent) }}</span>
          </div>
          <div
            class="company col-span-4 font-bold self-center"
            :class="{ 'grayed-out': !item.Quote }"
          >
            {{ item.Company }}
          </div>
          <div
            v-for="year in years"
            :key="year + '_' + item.Id"
            class="text-center"
            :class="`col-span-${yearsColSpan}`"
          >
            <div class="grid grid-cols-2">
              <span
                class="value"
                :class="{
                  highlight: isMinimal('FIX', item, year, display),
                }"
              >
                {{ getFormatedValue("FIX", item, year, display) }}
              </span>
              <span
                class="value"
                :class="{
                  highlight: isMinimal('FRN', item, year, display),
                }"
              >
                {{ getFormatedValue("FRN", item, year, display) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Secondary rows -->
        <div :class="{ hidden: !expandedItemIds.includes(item.Id) }">
          <div
            v-for="field in secondaryRows"
            :key="field + '_' + item.Id"
            class="grid grid-cols-12 border-b border-grayLight row"
          >
            <div class="col-span-2 placeholder"></div>
            <div class="col-span-4 self-center">{{ field }}</div>
            <div
              v-for="year in years"
              :key="year + '_' + field + '_' + item.Id"
              class="text-center"
              :class="`col-span-${yearsColSpan}`"
            >
              <div class="grid grid-cols-2">
                <span class="value">
                  {{ getFormatedValue("FIX", item, year, field) }}
                </span>
                <span class="value">
                  {{ getFormatedValue("FRN", item, year, field) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Footer -->
    <div class="grid grid-cols-12 border border-black py-1">
      <div class="col-span-2 placeholder"></div>
      <div class="col-span-4">Average by {{ display }}</div>
      <div
        v-for="year in years"
        :key="year + '_' + display"
        class="text-center"
        :class="`col-span-${yearsColSpan}`"
      >
        <div class="grid grid-cols-2">
          <span>{{ getAvg(year, "FIX") }}</span>
          <span>{{ getAvg(year, "FRN") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Carret from "@/components/svg/Carret";
import Chevron from "@/components/svg/Chevron";
import months from "@/utils/months";

export default {
  name: "CustomTable",
  components: { Carret, Chevron },
  props: {
    dataSet: { type: Array, default: () => [] },
    years: { type: Array, default: () => [5, 10, 40] },
    currency: { type: String, default: "USD" },
    display: { type: String, default: "Spread" },
    displayOptions: { type: Array, default: () => [] },
  },
  data() {
    return {
      withQuote: [],
      withoutQuote: [],
      orderedDataset: [],
      currentSortBy: "DateSent",
      sortStatus: { Company: 1, DateSent: 1 }, // asc/desc
      mins: [],
      avgs: [],
      maxYears: 3,
      colSpanPerYear: 2,
      expandedItemIds: [],
    };
  },
  computed: {
    secondaryRows() {
      return this.displayOptions.filter((option) => option !== this.display);
    },
    yearsColSpan() {
      return (this.maxYears * this.colSpanPerYear) / this.years.length;
    },
  },

  watch: {
    dataSet() {
      this.initDataset();
    },
    years() {
      this.computeMinAndAvg(this.withQuote);
    },
    currency() {
      this.computeMinAndAvg(this.withQuote);
    },
    display() {
      this.computeMinAndAvg(this.withQuote);
    },
  },

  mounted() {
    this.initDataset();
  },

  methods: {
    initDataset() {
      this.withQuote = this.dataSet.filter((i) => i.Quote);
      this.withoutQuote = this.dataSet.filter((i) => !i.Quote);
      this.computeMinAndAvg(this.withQuote);
      this.sortBy(this.currentSortBy);
    },

    sortBy(key) {
      this.sortStatus[key] *= -1;
      this.withQuote.sort((a, b) => this.sort(a, b, key));
      this.withoutQuote.sort((a, b) => this.sort(a, b, key));
      this.orderedDataset = this.withQuote.concat(this.withoutQuote);
      this.currentSortBy = key;
    },

    sort(a, b, key) {
      let sort = a[key] > b[key] ? 1 : -1;
      return sort * this.sortStatus[key];
    },

    computeMinAndAvg(data) {
      this.mins = {};
      this.avgs = {};
      let accByYears = {}; //accumulator
      let minByYears = {};

      this.years.forEach((years) => {
        accByYears[years] = {
          FIX: { sum: 0, length: 0 },
          FRN: { sum: 0, length: 0 },
        };
        minByYears[years] = {
          FIX: 0,
          FRN: 0,
        };
      });

      data.forEach((item) => {
        item.Quote.forEach((q) => {
          if (q.Currency === this.currency) {
            this.years.forEach((years) => {
              if (q.Years === years) {
                const accByYear = accByYears[years];
                if (q[this.display]) {
                  accByYear[q.CouponType].sum += q[this.display];
                  accByYear[q.CouponType].length++;
                  const minByYear = minByYears[years];
                  if (
                    minByYear[q.CouponType] === 0 ||
                    minByYear[q.CouponType] > q[this.display]
                  ) {
                    minByYear[q.CouponType] = q[this.display];
                  }
                }
              }
            });
          }
        });
      });

      this.years.forEach((years) => {
        const accByYear = accByYears[years];
        this.avgs[years] = {
          FIX: accByYear.FIX.sum / accByYear.FIX.length || null,
          FRN: accByYear.FRN.sum / accByYear.FRN.length || null,
        };
        const minByYear = minByYears[years];
        this.mins[years] = {
          FIX: minByYear.FIX || null,
          FRN: minByYear.FRN || null,
        };
      });
    },

    isMinimal(couponType, item, year, key) {
      return (
        this.getValue(couponType, item, year, key) ===
        this.mins[year][couponType]
      );
    },

    getAvg(year, field) {
      let value = this.avgs[year] ? this.avgs[year][field] : 0;
      if (!value) return "";
      value = this.formatValue(value, this.display);
      return value;
    },

    getValue(couponType, item, years, key) {
      const quote = item.Quote;
      if (!quote) return "";
      const quoteRow = quote.find(
        (q) =>
          q.Years == years &&
          q.CouponType === couponType &&
          q.Currency === this.currency
      );
      if (!quoteRow) return "";
      const value = quoteRow[key];
      return value;
    },

    getFormatedValue(couponType, item, years, key) {
      let value = this.getValue(couponType, item, years, key) || 0;
      if (!value) return "";
      return this.formatValue(value, key);
    },

    formatValue(value, field) {
      let retVal = "";
      switch (field) {
        case "Spread":
        case "3MLSpread":
          if (value > 0) retVal = "+";
          retVal = retVal + Math.round(value * 100) / 100 + "bp";
          break;
        case "Yield":
          retVal = Math.round(value * 1000) / 1000 + "%";
          break;
      }
      return retVal;
    },

    formatDate(_date) {
      if (!_date) return null;
      const parts = _date.match(/(\d+)/g);
      const date = new Date(parts[0], parts[1] - 1, parts[2]);
      const d = date.getDate();
      const m = date.getMonth(date);
      const y = date.getFullYear();
      return `${d}-${months[m]}-${y}`;
    },

    toggleExpanded(id) {
      const index = this.expandedItemIds.findIndex((item) => item === id);
      if (index !== -1) this.expandedItemIds.splice(index, 1);
      else this.expandedItemIds.push(id);
    },
  },
};
</script>

<style lang="scss" scoped>
.col-span-3 {
  grid-column: span 3 / span 3;
}
.col-span-6 {
  grid-column: span 6 / span 6;
}
.sorting-column {
  @apply flex items-center gap-2 cursor-pointer select-none;
}
.sorting-column:hover {
  @apply text-primary;
}
.row-line:last-child .row-inner {
  border: none;
}
.value,
.company {
  @apply py-1;
}
.grayed-out {
  @apply text-grayLight font-normal;
}
.highlight {
  @apply bg-grayLight;
  background-color: #0000000f;
}

.rotate-90 {
  transform: rotate(90deg);
}
.rotate-180 {
  transform: rotate(180deg);
}
</style>
