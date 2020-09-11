<template>
  <div class="navbar" :style="{ width: showSidebar ? '200px' : '50px' }">
    <div class="title" @click="openPage">
      <span v-show="showSidebar">Всі папки</span>
      <span v-show="!showSidebar">
        <i class="material-icons">folder_open</i>
      </span>
    </div>

    <transition-group name="modal-fade" tag="div" class="transition-container">
      <select-link v-for="folder in folders" 
        :key="`folder_${folder.id}`"
        :folder="folder"
        class="select-link"
        v-show="showSidebar"
      ></select-link>
    </transition-group>
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
     let prepayments = []

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

      await fetch(`${this.uri}/prepayments/`)
      .then(res => res.text())
      .then((data) => {
        try {
          prepayments = JSON.parse(data);
        } catch {
          console.log('err')
        }
      })

      folders.forEach(folder => {
        folder.people = people.filter(person => person.folder_id === folder.id)
        folder.people.forEach(person => {
          person.prepayments = prepayments.filter(pay => pay.worker === person.id)
        })
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
  props: {
    showSidebar: Boolean,
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
    justify-content: center;
    align-items: center;
    margin: 10px 0;
  }
  .transition-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: inherit;
    .select-link {
      margin: 5px 0;
    }
  }
}

@media only screen and (max-width: 920px) {
  .navbar {
    position: absolute;
    background: #333;
    z-index: 999;
  }
}
</style>