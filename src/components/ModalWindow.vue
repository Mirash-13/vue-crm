<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" role="dialog" @clickout.stop="emitingData(true)">
      <div class="modal" ref="modal" :class="modalsClass" @clickout="emitingData(false)">
        <slot name="modal">
            modal
        </slot>
        <button class="close" @click="emitingData(false)"></button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
    name: 'modal',
    methods: {
        emitingData(data) {
            this.$emit('clickOutside', data)
        }
    },
    props: {
        modalsClass: String
    }
};
</script>

<style lang="scss" scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.74);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    .modal {
      background: #F8F8F5;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      .close {
        border: none;
        background: none;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 24px;
        right: 24px;
        width: 24px !important;
        height: 24px !important;
        transition: .3s ease;
        &:hover {
          background: #ccc;
          transition: .3s ease;
        }
        &:before, &:after {
          content: "";
          position: absolute;
          width: 2px;
          height: 18px;
          background: var(--main-color);
          transform: rotate(45deg);
        }
        &:before {
          transform: rotate(-45deg);
        } 
      }
    }
}
</style>