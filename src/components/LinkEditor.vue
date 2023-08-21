<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const linkForm = reactive({});

function parseLink(rawLink) {
  if (!rawLink) {
    linkForm.type = "web";
    linkForm.path = rawLink;

    return;
  }

  const parts = rawLink.split("|");
  if (parts.length === 1) {
    linkForm.type = "web";
    linkForm.path = rawLink;
  } else {
    const protocol = parts[0];
    if (protocol === "web") {
      linkForm.type = "web";
      linkForm.path = parts[1];
    } else if (protocol === "page") {
      linkForm.type = "page";
      linkForm.path = parts[1];
    } else if (protocol === "miniprogram") {
      linkForm.type = "miniprogram";
      linkForm.appId = parts[1];
      linkForm.path = parts[2];
    }
  }
}

parseLink(props.modelValue);
watch(() => props.modelValue, parseLink);

watch(linkForm, (newForm) => {
  const protocol = newForm.type;
  let fullLink = "";
  if (protocol === "web") {
    fullLink = `web|${newForm.path}`;
  } else if (protocol === "page") {
    fullLink = `page|${newForm.path}`;
  } else if (protocol === "miniprogram") {
    fullLink = `miniprogram|${newForm.appId}|${newForm.path}`;
  }
  emit("update:modelValue", fullLink);
});
</script>

<template>
  <div class="tabs-wrapper">
    <el-tabs v-model="linkForm.type" type="border-card">
      <el-tab-pane label="网页" name="web">
        <el-form>
          <el-form-item label="链接地址">
            <el-input v-model="linkForm.path" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="内部页面" name="page">
        <el-form>
          <el-form-item label="页面路径">
            <el-input v-model="linkForm.path" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="外部小程序" name="miniprogram">
        <el-form label-width="100px">
          <el-form-item label="小程序 ID">
            <el-input v-model="linkForm.appId" />
          </el-form-item>
          <el-form-item label="链接地址">
            <el-input v-model="linkForm.path" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.tabs-wrapper {
  width: 100%;
}

.tabs-wrapper .el-tabs {
  width: 100%;
}

.el-tab-pane .el-form-item {
  margin-bottom: 18px;
}

.el-tab-pane .el-form-item:last-child {
  margin-bottom: 0px;
}
</style>
