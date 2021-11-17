<template>
  <header></header>
  <input ref="file" type="file" @change="handleChange" />
  <ul>
    <li v-for="(caseItem, i) in app.caseList" :key="caseItem.id">
      {{ i }} ==============
      <CaseListItem :case-item="caseItem" />
    </li>
  </ul>
</template>
<script>
import { mapActions, mapState } from "vuex";

import CaseListItem from "@/components/CaseListItem.vue";

import mock from "@/mock/example.json";
import { bigMock } from "@/mock/mock";

export default {
  name: "App",
  components: {
    CaseListItem,
  },
  computed: {
    ...mapState(["app"]),
  },
  mounted() {
    console.log("mock", mock);
    this.setApp(bigMock);
    console.log("this.app", this.app);

    // console.log(new File("file:///C:/Users/developer/Desktop/123.jpg"));

    fetch("file:///C:/Users/developer/Desktop/", { mode: "cors" })
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "123.jpg", { type: "image/png" });
        console.log(file);
      });
  },
  methods: {
    ...mapActions(["setApp"]),
    handleChange() {
      const file = this.$refs.file.files[0];
      if (file) {
        console.log(file);
        console.log("evt.files[0]", this.$refs.file.files);
      }
    },
  },
};
</script>
