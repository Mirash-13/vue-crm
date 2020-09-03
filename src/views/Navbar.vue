<template>
  <div class="navbar">
    <div class="title" @click="openPage">
      Всі папки
    </div>

    <select-link v-for="folder in folders" 
      :key="`folder_${folder.name}`"
      :folder="folder"
      class="select-link"
    ></select-link>
  </div>
</template>

<script>
import SelectLink from '../components/SelectLink'
import { mapGetters } from 'vuex'

export default {
  methods: {
   openPage() {
    if ( this.$route.name !== 'Folders' ) {
      this.$router.push({ name: 'Folders' })
    }
   } 
  },
  computed: {
    ...mapGetters(['folders']),
  },
  components: {
    SelectLink
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    width: 80%;
    display: flex;
    cursor: pointer;
  }
  .select-link {
    margin: 5px 0;
  }
}
</style>