<template>
  <ul>
    <li v-for="(item, i) in dropItem.itemList" :key="item.id">
      {{ i }} ---------------
      <ItemListItem :item="item" />
    </li>
  </ul>
</template>
<script>
import ItemListItem from "@/components/ItemListItem.vue";

export default {
  name: "DropListItem",
  props: {
    dropItem: { type: Object, required: true },
  },
  components: {
    ItemListItem,
  },
};
</script>
