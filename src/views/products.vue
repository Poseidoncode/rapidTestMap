<template>
  <section class="main-section px-3">
    <section class="search-block">
      <h5 class="big-title">公費COVID-19家用快篩試劑社區定點診所名單</h5>
      <div class="p-2 search-section">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">縣市別</span>

          <Dropdown
            v-model="selectedCity"
            :options="citiesData"
            placeholder="請選擇..."
            style="padding-top: 5px"
            optionLabel="text"
            optionValue="value"
            class="custom-height"
            @change="setZones"
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">鄉鎮市區別</span>

          <Dropdown
            v-model="selectedZone"
            :options="zones"
            placeholder="請選擇..."
            style="padding-top: 5px"
            optionLabel="text"
            optionValue="value"
            class="custom-height"
            @change="filterItems"
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">診所名稱</span>
          <InputText
            type="text"
            v-model="selectedClinic"
            @keydown.enter="filterItems"
            class="custom-search"
          />
        </div>
        <button
          class="text-white font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none custom-search"
          type="button"
          style="background: #0c69e1"
          @click="getData"
        >
          查詢
        </button>
        <button
          class="text-white font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none custom-search"
          type="button"
          style="background: #6a9f3e"
          @click="clearSearch"
        >
          清除
        </button>
      </div>
    </section>

    <header class="ecommerce-grid my-dark">
      <div v-for="(item, i) in headers" :key="`headers${i}`" class="header">
        {{ item.name }}
      </div>
    </header>
    <main
      class="ecommerce-grid"
      v-for="(item, idx) in items"
      :key="`content${idx}`"
      style="color: #39312e"
      :style="
        idx % 2 == 0
          ? 'background-color:#ffffff ;'
          : 'background-color:#e7f2f3;'
      "
    >
      <div class="content" style="cursor: pointer; padding-top: 3px">
        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 mb-1 text-sm"
          type="button"
          style="background: #0d4a9e"
        >
          地圖
        </button>
      </div>

      <div class="content" :title="item.縣市別">
        {{ item?.縣市別 || "" }}
      </div>
      <div class="content" :title="item.鄉鎮市區別">
        {{ item?.鄉鎮市區別 || "" }}
      </div>
      <div class="content" :title="item.診所名稱">
        {{ item?.診所名稱 || "" }}
      </div>
    </main>
    <main
      v-if="!items.length"
      class="mt-2 text-center text-xl font-semibold col-span-full"
      style="font-family: Microsoft JhengHei, Helvetica"
    >
      No Data
    </main>
    <footer class="grid grid-flow-col auto-cols-max justify-center">
      <Paginator
        v-model:first="offset"
        v-model:rows="rows"
        :totalRecords="totalItemsCount"
        :rowsPerPageOptions="[5, 10, 50]"
      ></Paginator>
      <div class="mt-4">共{{ totalItemsCount }}筆</div>
    </footer>
  </section>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { citiesData, zonesData } from "@/utils/constant.js";
import { getMapLists } from "Service/apis.js";

export default defineComponent({
  name: "function",
  components: {},
  setup() {
    //-----------ListData----------------
    //for list
    const headers = ref([
      { name: "操作", key: "", sortDesc: null },

      { name: "縣市別", key: "", sortDesc: null }, //必填
      { name: "鄉鎮市區別", key: "", sortDesc: null },
      { name: "診所名稱", key: "", sortDesc: null },
    ]);

    const items = ref([]);
    const allItems = ref([]);

    const offset = ref(0);
    const rows = ref(10);
    const totalItemsCount = ref(1);

    const toast = useToast();

    const filterItems = () => {
      //top & skip
      const page = +offset.value / +rows.value + +1;
      const skip = (page - 1) * rows.value;
      const top = rows.value;

      //search Filter
      let arr = JSON.parse(JSON.stringify(allItems.value));
      if (selectedCity.value) {
        arr = arr.filter((s) => `${s.縣市別}` == selectedCity.value);
      }
      if (selectedZone.value) {
        arr = arr.filter((s) => `${s.鄉鎮市區別}` == selectedZone.value);
      }
      if (selectedClinic.value) {
        arr = arr.filter((s) => s.MId.includes(selectedClinic.value));
      }

      totalItemsCount.value = arr.length;
      // this.totalCountStr = `共${arr.length} 筆`;

      //pageNow
      arr = arr.slice(skip, top + skip);
      items.value = JSON.parse(JSON.stringify(arr));
    };

    const getData = async () => {
      try {
        // //odata3 qs
        // const page = +offset.value / +rows.value + +1;
        // const skip = (page - 1) * rows.value;
        // const top = rows.value;

        // const obj = { top, skip };
        // // let qs = buildQuery(obj);
        // let bQs = false;
        // let qs = "";

        //top:筆數、skip:跳過幾筆

        const res = await getMapLists();

        // items.value = [...res.data?.result?.records];
        allItems.value = [...res.data?.result?.records];
        totalItemsCount.value = res.data?.result?.total || 0;
        filterItems();
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 2000,
          hideProgressBar: true,
        });
      }
    };

    const zones = ref([]);

    const setZones = () => {
      const arr = zonesData.find((s) => s.text == selectedCity.value);

      if (!!arr) {
        let arrData = [];
        arrData = arr.zone.map((s) => ({
          value: s,
          text: s,
        }));

        arrData.unshift({ text: "全部", value: null });
        zones.value = arrData;
      } else {
        zones.value = null;
      }
      selectedZone.value = null;
      filterItems();
    };

    //for search
    const selectedCity = ref(null);
    const selectedZone = ref(null);
    const selectedClinic = ref(null);

    const clearSearch = () => {
      selectedZone.value = null;
      selectedCity.value = null;
      selectedClinic.value = null;
      getData();
    };

    onMounted(async () => {
      await getData();
    });

    watch(offset, (v, pv) => {
      filterItems();
    });

    watch(rows, (v, pv) => {
      filterItems();
    });

    return {
      //for list data variable
      citiesData,
      zonesData,
      headers,
      items,
      allItems,
      toast,
      zones,
      setZones,
      //list data Function
      getData,
      filterItems,

      //paginator
      offset, //目前在第幾筆
      rows, //1頁顯示筆數
      totalItemsCount,

      //for search
      selectedZone,
      selectedCity,
      selectedClinic,

      clearSearch,
    };
  },
});
</script>

<style lang="scss" scoped>
.search-block {
  .big-title {
    background: #e1e8f5;
    padding: 5px;
    color: #333;
    border-radius: 0.15rem 0.15rem 0 0;
    font-size: 20px;
    font-weight: bold;
  }
  margin-bottom: 6px;
  margin-top: 10px;
  background: #fbfcf9;
  border: 1px solid #bdbdbd;
  border-radius: 0.25rem 0.25rem 0 0;

  .search-section {
    display: grid;
    grid-template-columns: repeat(8, max-content);
    grid-column-gap: 6px;
  }
}

.p-inputgroup-addon {
  width: 135px;
  background: #3b86f2;
  color: #ffffff;
  font-weight: bold;
  border: 0px !important;
}

.custom-search {
  // height: 42px;
}
.p-dropdown {
  line-height: 12px;
}
.ecommerce-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  text-align: center;

  > div {
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    font-size: 15px;
    padding: 4px 0;
    border-right: 2px solid #ffffff;
    border-bottom: 2px solid #ffffff;
    display: -webkit-box;
    height: 40px;
    line-height: 30px;
    font-size: 16px;
    color: rgb(46, 45, 45);
  }
  > div:first-child {
    border-left: 2px solid #ffffff;
  }
  > .header {
    line-height: 2rem;
    font-weight: 700;
    color: #1c2a54;
  }
  > .content {
    padding: 6px;
    padding-top: 4px;
    height: 43px;
  }
  > .full-content {
    grid-column: 1 / -1;
  }
}

.my-dark {
  > div {
    background: #e0fbfc;
    color: #f3f3f3;
    font-weight: bolder;
  }
}
</style>
