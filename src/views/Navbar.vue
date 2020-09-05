<template>
  <div class="navbar">
    <div class="title" @click="openPage">
      Всі папки
    </div>

    <select-link v-for="folder in folders" 
      :key="`folder_${folder.id}`"
      :folder="folder"
      class="select-link"
    ></select-link>
  </div>
</template>

<script>
import SelectLink from '../components/SelectLink'
import { mapGetters, mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations(['setFolders']),
   openPage() {
    if ( this.$route.name !== 'Folders' ) {
      this.$router.push({ name: 'Folders' })
    }
   },
   async queryDate(){
     let folders = []
     let people = []

      await fetch(`${this.uri}/folders/`)
      .then(res => res.text())
      .then((data) => {
        try {
          folders = JSON.parse(data);
        } catch {
          console.log('err')
        }
      })

      await fetch(`${this.uri}/workers/`)
      .then(res => res.text())
      .then((data) => {
        try {
          people = JSON.parse(data);
        } catch {
          console.log('err')
        }
      })

      folders.forEach(folder => {
        folder.people = people.filter(person => person.folder_id === folder.id)
      })

      this.setFolders(folders)
    }
  },
  mounted() {
    this.queryDate()
  },
  computed: {
    ...mapGetters(['folders', 'uri']),
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