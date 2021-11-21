<template>
  <div v-if="isOpen" class="confirm-modal" @click="handleClose">
    <section class="confirm-modal__content" @click.stop>
      <UiFAIconCircleButton
        class="confirm-modal__button-close"
        icon="times"
        title="Close"
        @click="handleClose"
      />
      <h2 class="confirm-modal__title">{{ title }}</h2>
      <ul class="confirm-modal__buttons">
        <li>
          <UiButton @click="handleConfirm">Yes</UiButton>
        </li>
        <li>
          <UiButton @click="handleClose">No</UiButton>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
import UiButton from "@/components/ui-kit/UiButton.vue";
import UiFAIconCircleButton from "@/components/ui-kit/UiFAIconCircleButton.vue";

export default {
  components: {
    UiButton,
    UiFAIconCircleButton,
  },
  data() {
    return {
      isOpen: false,
      title: "Delete?",
    };
  },

  currentPopupController: null,

  watch: {
    isOpen(newVal) {
      if (newVal) {
        document.addEventListener("keydown", this.handleEscClick);
        document.body.classList.add("popup-open");
      } else {
        document.removeEventListener("keydown", this.handleEscClick);
        document.body.classList.remove("popup-open");
      }
    },
  },

  methods: {
    open({ title }) {
      this.title = title;

      let resolve;
      let reject;
      const popupPromise = new Promise((ok, fail) => {
        resolve = ok;
        reject = fail;
      });

      this.$options.popupController = { resolve, reject };
      this.isOpen = true;

      return popupPromise;
    },
    handleConfirm() {
      this.$options.popupController.resolve(true);
      this.isOpen = false;
    },
    handleClose() {
      this.$options.popupController.resolve(false);
      this.isOpen = false;
    },
    handleEscClick(evt) {
      const ESC_KEY_CODE = 27;
      if (evt.keyCode === ESC_KEY_CODE) {
        this.handleClose();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
}
.confirm-modal__content {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 101;
  display: flex;
  flex-direction: column;
  min-width: 320px;
  min-height: 150px;
  padding: 30px;
  padding-top: 40px;
  background-color: #ffffff;
  box-shadow: rgb(9 30 66 / 25%) 0px 4px 8px -2px, rgb(9 30 66 / 8%) 0px 0px 0px 1px;
  border-radius: 10px;
  transform: translateX(-50%) translateY(-50%);
}
.confirm-modal__title {
  text-align: center;
  margin-bottom: auto;
}
.confirm-modal__buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
.confirm-modal__button-close {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
