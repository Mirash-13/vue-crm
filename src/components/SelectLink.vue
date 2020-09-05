<template>
  <div class="link">
    <div class="title" @click="openFolder(folder.title)">
      {{ folder.title }}

      <div @click.stop="show = !show"
        v-if="folder.people.length"
        :style="{
          transform: `rotate(${ show ? 225 : 45 }deg)`
        }"
        class="arrow"
      ></div>
    </div>
    
    <transition name="show">
      <div v-show="show" class="people scroll">
        <div v-for="person in folder.people"
          :key="`person_${person.name}`"
          class="person"
          @click="openPerson(person.name)"
        >
          {{ person.name }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SelectLink',
  data: () => ({
    show: false
  }),
  methods: {
    openFolder(folder) {
      if ( this.$route.params.folder !== folder ) {
        this.$router.push({ name: 'Folder', params: { folder: folder } })
      }
    },
    openPerson(person) {
      if ( this.$route.query.person !== person ) {
        this.$router.push({ name: 'Person', query: { person: person, folder: this.folder.title } })
      }
    }
  },
  props: {
    folder: Object
  }
}
</script>

<style scoped lang="scss">
.link {
  background: #5a5a5a;
  display: flex;
  flex-direction: column;
  width: 75%;
  font-size: 14px;
  border-radius: 12px;
  transition: .3s ease;
  overflow: hidden;
  cursor: pointer;
  .title {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 3px 8px;
    font-size: 14px;
    &:hover {
      text-decoration: underline;
    }
    .arrow {
      position: absolute;
      right: 0;
      height: 20px;
      width: 20px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: .3s ease;
      &::after {
        content: "";
        position: absolute;
        border: solid black;
        border-width: 0 2px 2px 0;
        display: inline-block;
        padding: 3px;
        transform: translate(-1px, -1px);
      }
      &:hover {
        background: rgb(175, 174, 174);
        transition: .3s ease;
      }
    }
  }
  .people {
    padding: 3px 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    max-height: 200px;
    overflow: auto;
    margin: 0 2px 5px 0;
    .person {
      width: 95%;
      display: flex;
      font-size: 12px;
      color: rgb(212, 212, 212);
      &:hover {
        text-decoration: underline;
        color: white;
      }
    }
  }
}

.show-enter-active, .show-leave-active {
  transition: opacity .3s ease;
}
.show-enter, .show-leave-to
/* .component-fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
</style>
