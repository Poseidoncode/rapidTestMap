<template>
  <sidebar @setMarker="setMarker" @setCenterData="setCenterData"></sidebar>

  <div style="height: 100vh; width: 100vw">
    <l-map
      v-model="zoom"
      v-model:zoom="zoom"
      :center="[ceterdata.Lat, ceterdata.Long]"
      @move="log('move')"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ></l-tile-layer>
      <l-control-layers />

      <l-marker :lat-lng="[userLat, userLong]">
        <l-icon
          icon-url="https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png"
          :icon-size="[25, 41]"
        />
        <l-popup>
          <p>目前位置</p>
        </l-popup>
        <l-tooltip
          :options="{
            permanent: true,
          }"
          >目前位置
        </l-tooltip>
      </l-marker>

      <l-marker
        v-for="(item, i) in allMarkers"
        :key="`allMarkers${i}`"
        :lat-lng="[item.Lat, item.Long]"
      >
        <l-icon
          icon-url="https://cdn-icons-png.flaticon.com/512/3028/3028573.png"
          :icon-size="[50, 55]"
        />
        <l-tooltip>
          <p class="mb-2 text-base">
            診所名稱: <b style="color: #013b7d">{{ item.診所名稱 || "" }}</b>
          </p>
          <p class="mb-2 text-base">
            診所地址: <b style="color: #013b7d">{{ item.診所地址 || "" }}</b>
          </p>
          <p class="mb-2 text-base">
            診所電話: <b style="color: #013b7d">{{ item.診所電話 || "" }}</b>
          </p>
        </l-tooltip>
        <l-popup>
          <p v-show="item.showMarker">診所名稱: {{ item.診所名稱 || "" }}</p>
          <p>診所地址: {{ item.診所地址 || "" }}</p>
          <p>診所電話: {{ item.診所電話 || "" }}</p>
        </l-popup>
      </l-marker>

      <!-- <l-marker
        :lat-lng="[25.06752703436326, 121.57563054124498]"
        draggable
        @moveend="log('moveend')"
      >
        <l-tooltip> lol </l-tooltip>
      </l-marker> -->

      <!-- <l-marker :lat-lng="[47.41322, -1.219482]">
        <l-icon :icon-url="iconUrl" :icon-size="iconSize" />
      </l-marker>

      <l-marker :lat-lng="[50, 50]" @moveend="log('moveend')">
        <l-popup> lol </l-popup>
      </l-marker>

      <l-polyline
        :lat-lngs="[
          [47.334852, -1.509485],
          [47.342596, -1.328731],
          [47.241487, -1.190568],
          [47.234787, -1.358337],
        ]"
        color="green"
      ></l-polyline>
      <l-polygon
        :lat-lngs="[
          [46.334852, -1.509485],
          [46.342596, -1.328731],
          [46.241487, -1.190568],
          [46.234787, -1.358337],
        ]"
        color="#41b782"
        :fill="true"
        :fillOpacity="0.5"
        fillColor="#41b782"
      />
      <l-rectangle
        :lat-lngs="[
          [46.334852, -1.509485],
          [46.342596, -1.328731],
          [46.241487, -1.190568],
          [46.234787, -1.358337],
        ]"
        :fill="true"
        color="#35495d"
      />
      <l-rectangle
        :bounds="[
          [46.334852, -1.190568],
          [46.241487, -1.090357],
        ]"
      >
        <l-popup> lol </l-popup>
      </l-rectangle> -->
    </l-map>
    <!-- <button @click="changeIcon">New kitten icon</button> -->
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch, computed } from "vue";
import { useToast } from "vue-toastification";
import { citiesData, zonesData } from "@/utils/constant.js";
import { getMapLists } from "Service/apis.js";
import sidebar from "./sidebar.vue";
import { useStore } from "vuex";
import {
  LMap,
  LIcon,
  LTileLayer,
  LMarker,
  LControlLayers,
  LTooltip,
  LPopup,
  LPolyline,
  LPolygon,
  LRectangle,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

export default defineComponent({
  name: "function",
  components: {
    LMap,
    LIcon,
    LTileLayer,
    LMarker,
    LControlLayers,
    LTooltip,
    LPopup,
    LPolyline,
    LPolygon,
    LRectangle,
    sidebar,
  },
  setup() {
    const showNowMarker = ref(false);
    const store = useStore();
    const componentsKey = ref(0);
    //map
    const ceterdata = ref({
      Lat: 25.053065384952,
      Long: 121.59537159907072,
    });
    const zoom = ref(12);

    const log = (a) => {
      console.log(a);
    };

    const allMarkers = ref([]);

    const setMarker = (data) => {
      allMarkers.value = [...data];
    };

    const setCenterData = (data) => {
      ceterdata.value.Lat = data.Lat;
      ceterdata.value.Long = data.Long;
      zoom.value = 16;

      const index = allMarkers.value.findIndex((s) => s.Lat === data.Lat);
      console.log("index", index);
      if (index > -1) {
        allMarkers.value[index].showMarker = true;
        console.log("allMarkers", allMarkers.value);
        showNowMarker.value = true;
      }

      // if (data.needbuild) {
      //   componentsKey.value += 1;
      // }
    };

    const userLat = computed(() => {
      return store.state.user.locale?.Lat;
    });

    const userLong = computed(() => {
      return store.state.user.locale?.Long;
    });

    return {
      ceterdata,
      allMarkers,
      setMarker,
      setCenterData,
      zoom,
      log,

      userLat,
      userLong,

      showNowMarker,
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

::v-deep(.leaflet-right) {
  display: none;
}
</style>
