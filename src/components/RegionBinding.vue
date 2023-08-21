<script setup>
import regionApi from "@/requests/region";
import { ref, watch } from "vue";

const props = defineProps({
  sourceType: String,
  sourceId: Number,
  selectedRegions: Array,
});

const showModal = ref(false);
const regions = ref([]);
const selectedRegion = ref();
const selectedRegions = ref(props.selectedRegions);

watch(
  () => props.selectedRegions,
  (newVal) => {
    selectedRegions.value = newVal;
  }
);

async function updateRegions() {
  selectedRegion.value = undefined;
  const selectedRegionsRes = await regionApi.getBindings(props.sourceType, props.sourceId);
  selectedRegions.value = selectedRegionsRes;
  const selectedRegionIds = selectedRegionsRes.map((item) => item.id);

  const regionsRes = await regionApi.getRegions();
  regions.value = regionsRes.filter((item) => !selectedRegionIds.includes(item.id));
}

async function onSelected(regionId) {
  await regionApi.createBind(regionId, props.sourceType, props.sourceId);
  updateRegions();
}

async function removeRegionBinding(regionId) {
  await regionApi.removeBind(regionId, props.sourceType, props.sourceId);
  updateRegions();
}

function regionBinding() {
  updateRegions();
  showModal.value = true;
}
</script>

<template>
  <el-dialog v-model="showModal" :append-to-body="true" width="50%" top="20px">
    <el-form label-width="120px">
      <el-form-item label="生效区域">
        <div class="selected-wrapper">
          <el-tag
            v-for="region in selectedRegions"
            :key="region.id"
            class="mx-1"
            size="large"
            closable
            @close="removeRegionBinding(region.id)"
          >
            {{ region.name }}
          </el-tag>
        </div>
        <el-divider />
        <div class="select-wrapper">
          <el-select v-model="selectedRegion" filterable :reserve-keyword="false" @change="onSelected">
            <div v-for="item in regions">
              <el-option :key="item.id" :value="item.id" :label="item.name" />
            </div>
          </el-select>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
  <div v-for="region in selectedRegions" :key="region.id">{{ region.name }},</div>
  <el-button size="small" @click="regionBinding" round> 已绑定（{{ selectedRegions.length }}） </el-button>
</template>

<style scoped>
.select-wrapper {
  width: 100%;
}

.selected-wrapper .el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.select-wrapper .el-select {
  width: 100%;
}
</style>
