import { defineStore } from "pinia";
import { ElMessage } from "element-plus";

export const useAlertStore = defineStore("alert", {
  state: () => ({ show: false }),
  actions: {
    showAlert(message) {
      this.show = true;
      ElMessage({
        showClose: true,
        message: message,
        type: "error",
      });
    },

    hideAlert() {
      this.show = false;
    },
  },
});
