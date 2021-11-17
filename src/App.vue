<template>
  <header></header>
  <input ref="file" type="file" @change="handleChange" />
  <draggable
    :model-value="app.caseList"
    class="case-list"
    tag="ul"
    item-key="id"
    @change="handleDraggableChange"
  >
    <template #item="{ element }">
      <li class="case-list-item">
        Case list item: {{ element.caseName }}
        <CaseListItem :case-item="element" />
      </li>
    </template>
  </draggable>
</template>
<script>
import { mapActions, mapState } from "vuex";
import draggable from "vuedraggable";

import CaseListItem from "@/components/CaseListItem.vue";

import mock from "@/mock/example.json";
import { bigMock } from "@/mock/mock";

export default {
  name: "App",
  components: {
    CaseListItem,
    draggable,
  },
  computed: {
    ...mapState(["app"]),
  },
  mounted() {
    console.log("mock", mock);
    this.setApp(bigMock);
    console.log("this.app", this.app);

    // console.log(new File("file:///C:/Users/developer/Desktop/123.jpg"));

    // fetch("file:///C:/Users/developer/Desktop/", { mode: "cors" })
    //   .then((res) => res.blob())
    //   .then((blob) => {
    //     const file = new File([blob], "123.jpg", { type: "image/png" });
    //     console.log(file);
    //   });
  },
  methods: {
    ...mapActions(["setApp", "handleDraggableCaseListMoved"]),
    handleChange() {
      const file = this.$refs.file.files[0];
      if (file) {
        console.log(file);
        console.log("evt.files[0]", this.$refs.file.files);
      }
    },
    handleDraggableChange({ moved }) {
      this.handleDraggableCaseListMoved(moved);
    },
  },
};
</script>
<style lang="scss" scoped>
.case-list {
  display: flex;
  flex-wrap: wrap;
}
.case-list-item {
  background-color: lightcoral;
  margin: 5px;
}
</style>
