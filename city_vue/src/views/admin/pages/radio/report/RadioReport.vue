<script>
import axios from "axios";

export default {
  data() {
    return {
      radioReportIframe: "",
    };
  },
  methods: {
    getRadioReport() {
      const vm = this;
      const config = {
        method: "GET",
        url: "./radioReport",
      };

      axios(config)
        .then((res) => {
          console.log(res.data);
          vm.radioReportIframe = res.data;
        })
        .catch((err) => console.log(err.response));
    },
  },
  mounted() {
    this.getRadioReport();
  },
};
</script>

<template>
  <div>
    <iframe
      :src="radioReportIframe"
      frameborder="0"
      width="100%"
      allowtransparency
      style="height: calc(100vh - 128px)"
    ></iframe>
  </div>
</template>
