<template>
  <div class="input-list-item">
    <input type="text" :value="item.itemPrice" @change="updateInputValue($event, 'itemPrice')" />
    <input type="text" :value="item.itemName" @change="updateInputValue($event, 'itemName')" />
    <input type="text" :value="item.skinName" @change="updateInputValue($event, 'skinName')" />
    <img :src="item.skinImg" alt="#" />
    <!-- <img src="file:///C:/Users/developer/Desktop/123.jpg" alt="#" /> -->
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  name: "ItemListImte",
  props: {
    item: { type: Object, required: true },
  },
  methods: {
    ...mapActions(["updateItemData"]),
    updateInputValue(evt, fieldName) {
      const { value } = evt.target;

      this.updateItemData({
        id: this.item.id,
        data: { key: fieldName, value },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.input-list-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  padding: 8px;
  background: lightgray;
}
</style>
