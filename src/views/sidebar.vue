<template>
  <div class="open-icon" v-show="!cartOpen" @click="cartOpen = !cartOpen">
    <i class="pi pi-angle-left" style="font-size: 2rem"></i>
  </div>
  <div class="close-icon" v-show="cartOpen" @click="cartOpen = !cartOpen">
    <i class="pi pi-angle-right" style="font-size: 2rem"></i>
  </div>
  <div class="totop-icon" v-show="cartOpen" @click="scrollToTop">
    <i class="pi pi-angle-up" style="font-size: 2rem"></i>
  </div>

  <div
    :class="cartOpen ? 'translate-x-0 ease-out' : 'translate-x-full ease-in'"
    class="fixed right-0 top-0 max-w-md w-full h-full px-6 py-4 transition duration-300 transform overflow-y-auto bg-white border-l-2 border-gray-300"
    style="z-index: 1000"
    @scroll="scrollEvent"
  >
    <div class="flex items-center justify-between" id="bigtitle">
      <h3 class="font-extrabold text-gray-700 mb-1 sm:text-xs md:text-xl">
        COVID-19家用快篩試劑定點診所名單
      </h3>
    </div>
    <div class="p-inputgroup mb-1">
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
        :showClear="true"
        :filter="true"
      />
    </div>
    <div class="p-inputgroup mb-1">
      <span class="p-inputgroup-addon">鄉鎮市區別</span>

      <Dropdown
        v-model="selectedZone"
        :options="zones"
        placeholder="請選擇..."
        style="padding-top: 5px"
        optionLabel="text"
        optionValue="value"
        class="custom-height"
        @change="getData"
        :showClear="true"
        :filter="true"
      />
    </div>
    <div class="p-inputgroup mb-2">
      <span class="p-inputgroup-addon">診所名稱</span>
      <InputText
        type="text"
        v-model="selectedClinic"
        @keydown.enter="getData"
        class="custom-search"
      />
    </div>
    <div class="flex justify-end">
      <button
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-3 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        @click="clearSearch"
      >
        清除搜尋條件
      </button>
    </div>

    <hr class="my-3" />

    <div v-for="(item, i) in items" :key="`headers${i}`" class="mt-2">
      <div class="max-w-2xl mx-auto">
        <div
          class="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="p-5">
            <a href="#">
              <h5
                class="text-gray-900 font-bold text-2xl tracking-tight mb-2 dark:text-white"
                @click.prevent="setCenter(item)"
              >
                {{ item.診所名稱 || "" }}
              </h5>
            </a>
            <p class="font-normal text-gray-700 mb-1 dark:text-gray-400">
              地址: {{ item.診所地址 || "" }}
            </p>
            <p class="font-normal text-gray-700 mb-3 dark:text-gray-400">
              電話: {{ item.診所電話 || "" }}
            </p>
            <a
              href="#"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              @click.prevent="setCenter(item)"
            >
              Map
              <!-- <svg
                class="-mr-1 ml-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg> -->
            </a>

            <a
              href="#"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2"
              @click.prevent="searchDestination(item)"
            >
              搜尋診所
              <svg
                class="-mr-1 ml-2 h-4 w-4 hide-item"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
            <a
              href="#"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2"
              @click.prevent="setDestination(item)"
            >
              <span class="hide-item">Google</span>
              導航
              <svg
                class="-mr-1 ml-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, inject, ref, onMounted, watch, computed } from "vue";
import { useToast } from "vue-toastification";
import { citiesData, zonesData } from "@/utils/constant.js";
import { getMapLists } from "Service/apis.js";
import { useStore } from "vuex";
export default defineComponent({
  props: {},
  emits: ["setMarker", "setCenterData"],
  setup(props, { emit }) {
    const store = useStore();
    const cartOpen = ref(true);

    const headers = ref([
      { name: "操作", key: "", sortDesc: null },

      { name: "縣市別", key: "", sortDesc: null }, //必填
      { name: "鄉鎮市區別", key: "", sortDesc: null },
      { name: "診所名稱", key: "", sortDesc: null },
    ]);

    const items = ref([]);

    const toast = useToast();

    const getData = async () => {
      try {
        let hasQsed = false;
        let qs = "";

        if (selectedCity.value) {
          qs = qs + `縣市別 LIKE '${selectedCity.value}'`;
          hasQsed = true;
        }
        if (selectedZone.value) {
          if (hasQsed) {
            qs = qs + `And 鄉鎮市區別 LIKE '${selectedZone.value}'`;
          } else {
            qs = qs + `鄉鎮市區別 LIKE '${selectedZone.value}'`;
          }
        }
        if (selectedClinic.value) {
          if (hasQsed) {
            qs = qs + `And 診所名稱 LIKE '${selectedClinic.value}'`;
          } else {
            qs = qs + `診所名稱 LIKE '${selectedClinic.value}'`;
          }
        }

        if (
          !selectedCity.value &&
          !selectedZone.value &&
          !selectedClinic.value
        ) {
          return;
        }

        const res = await getMapLists(qs);
        let arr = res.data?.result?.records.map((s) => {
          return s;
        });
        items.value = [...res.data?.result?.records];

        emit("setMarker", [...arr]);
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
      getData();
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

    const setCenter = (item) => {
      // console.log("setCenter-win", window.innerWidth);
      if (window.innerWidth < 500) {
        cartOpen.value = false;
      }
      emit("setCenterData", item);
    };

    const setDestination = async (item) => {
      if (Boolean(store.state.user.locale?.Lat)) {
        window.open(
          `https://www.google.com/maps/dir/${store.state.user.locale?.Lat},+${store.state.user.locale?.Long}/${item.診所地址}`
        );
      } else {
        await getLocaleData();
        window.open(
          `https://www.google.com/maps/dir/${store.state.user.locale?.Lat},+${store.state.user.locale?.Long}/${item.診所地址}`
        );
      }
    };

    const searchDestination = (item) => {
      window.open(
        `https://www.google.com/search?q=${item.診所名稱}&sourceid=chrome&ie=UTF-8`
      );
    };

    const optionsLocale = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const successLocale = (pos) => {
      const crd = pos.coords;

      const obj = {
        Lat: crd.latitude,
        Long: crd.longitude,
      };

      sessionStorage.setItem("localeData", JSON.stringify(obj));

      let zoneArr = zonesData.map((s) => {
        s.latDifference = Math.abs(+crd.latitude - +s.lat);
        s.lngDifference = Math.abs(+crd.longitude - +s.lng);
        s.differenceTotal =
          Math.abs(+crd.latitude - +s.lat) + Math.abs(+crd.longitude - +s.lng);
        return s;
      });

      zoneArr.sort((a, b) => {
        return a.differenceTotal - b.differenceTotal;
      });

      selectedCity.value = zoneArr[0].text;

      setZones();

      emit("setCenterData", obj);
      store.commit("m_setUserLocale", obj);
    };

    const errorLocale = (err) => {
      toast.error(`需同意定位才能找到最近地點`, {
        timeout: 3000,
        hideProgressBar: true,
      });
      console.warn("ERROR(" + err.code + "): " + err.message);
    };

    const getLocaleData = () => {
      const localeData = sessionStorage.getItem("localeData")
        ? JSON.parse(sessionStorage.getItem("localeData"))
        : "";

      if (!Boolean(localeData)) {
        navigator.geolocation.getCurrentPosition(
          successLocale,
          errorLocale,
          optionsLocale
        );
      } else {
        const obj = {
          ...localeData,
        };

        let zoneArr = zonesData.map((s) => {
          s.latDifference = Math.abs(+localeData.Lat - +s.lat);
          s.lngDifference = Math.abs(+localeData.Long - +s.lng);
          s.differenceTotal =
            Math.abs(+localeData.Lat - +s.lat) +
            Math.abs(+localeData.Long - +s.lng);
          return s;
        });

        zoneArr.sort((a, b) => {
          return a.differenceTotal - b.differenceTotal;
        });

        selectedCity.value = zoneArr[0].text;

        setZones();
        emit("setCenterData", obj);
        store.commit("m_setUserLocale", localeData);
      }
    };

    onMounted(async () => {
      await getLocaleData();
    });

    const scrollEvent = () => {
      console.log("scrollEvent", window);
    };

    const scrollToTop = () => {
      // window.scrollTo(0, 0);
      document
        .getElementById("bigtitle")
        .scrollIntoView({ behavior: "smooth" });
    };

    return {
      scrollEvent,
      scrollToTop,
      //for list data variable
      citiesData,
      zonesData,
      headers,
      items,

      toast,
      zones,
      setZones,
      //list data Function
      getData,

      //paginator

      //for search
      selectedZone,
      selectedCity,
      selectedClinic,

      clearSearch,
      cartOpen,

      setCenter,
      setDestination,
      searchDestination,
    };
  },
});
</script>

<style lang="scss" scoped>
.list-content {
  width: 1200px;
}

.open-icon,
.close-icon {
  position: fixed;
  z-index: 1500;
  right: 41px;
  top: 8px;
  cursor: pointer;
  color: #fff;
  background: #1c54d4;
  border-radius: 50%;
  display: flex;
  justify-content: center;
}

.totop-icon {
  position: fixed;
  z-index: 1500;
  right: 41px;

  cursor: pointer;
  color: #fff;
  background: #f5c664;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  bottom: 30px;
}

.p-inputgroup-addon {
  color: #fff;
  background: #1c54d4;
  width: 97px;
}

.hide-item {
  display: block;
}
@media screen and (max-width: 500px) {
  .hide-item {
    display: none !important;
  }
  .open-icon,
  .close-icon {
    top: 29px !important;
  }
}
</style>
