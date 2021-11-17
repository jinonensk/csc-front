<template>
  <ul>
    <li v-for="(dropItem, i) in caseItem.dropList" :key="dropItem.id">
      {{ i }} +++++++++++
      <DropListItem :drop-item="dropItem" />
    </li>
  </ul>
</template>
<script>
import DropListItem from "@/components/DropListItem.vue";

export default {
  name: "CaseListItem",
  props: {
    caseItem: { type: Object, required: true },
  },
  components: {
    DropListItem,
  },
};
</script>
