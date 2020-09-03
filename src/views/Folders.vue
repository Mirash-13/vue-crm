<template>
  <div class="folder">
    <div class="header">
      <div class="title">
        All folders
      </div>

      <div class="actions">
        <input type="search" v-model="search">
        <button @click="showModal = true">add folder</button>
      </div>
    </div>

    <div class="list">
      <div v-for="folder in sortedFolders" :key="`folder_list_${folder.name}`" class="folder">
          {{ folder.name }}
      </div>

      <div class="empty" v-if="!sortedFolders.length">
          empty
      </div>
    </div>

    <transition name="modal-fade">
        <ModalWindow @clickOutside="(close) => showModal === true ? showModal = close : showModal = showModal"
            v-if="showModal"
        >
            <template #modal>
                <div class="modal">
                    <div class="title">Input folder's name</div>

                    <div class="input">
                        <input type="text" maxlength="25" v-model="inputFolder" @keydown.enter="addFolder">
                        <div class="error">
                            {{ error }}
                        </div>
                    </div>

                    <div class="buttons">
                        <button class="close" @click="showModal = false">close</button>
                        <button class="add" @click="addFolder">add</button>
                    </div>
                </div>
            </template>
        </ModalWindow>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ModalWindow from '../components/ModalWindow'

export default {
  name: 'Folders',
  data: () => ({
      search: "",
      showModal: false,
      inputFolder: "",
      error: ""
  }),
  methods: {
      ...mapMutations(['createFolder']),
      addFolder() {
          if ( this.inputFolder.length ) {
              if ( !this.folders.filter(folder => folder.name === this.inputFolder).length ) {
                  let data = { name: this.inputFolder, people: [] }
    
                  this.createFolder(data)
    
                  this.showModal = false
                  this.inputFolder = ""
              } else {
                  this.setError("this folder already exist")
              }
          } else {
            this.setError("field can't be empty")
          }
      },
      setError(text) {
        this.error = text
        setTimeout(() => {
            this.error = ""
        }, 5000)
      }
  },
  computed: {
    ...mapGetters(['folders']),
    sortedFolders() {
        return this.folders.filter(folder => folder.name.toLowerCase().trim().includes(this.search.toLowerCase().trim()))
    }
  },
  components: {
      ModalWindow
  }
}
</script>

<style lang="scss" scoped>
.folder {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background: #e6e6e6;
  border-radius: 8px;
  color: #1D2D36;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 14px;
      font-weight: bold;
    }
    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 25px;
      input {
        border: none;
        font-size: 12px;
        padding: 4px 8px;
        margin: 0 10px;
        height: 100%;
        width: 200px;
        box-shadow: 0 0 3px #ccc;
      }
      button {
        height: 100%;
        width: 80px;
        padding: 0 5px;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #000;
        background-color: #ccc;
        transition: .2s ease;
        &:hover {
          background-color: #fff;
          border: 1px solid #ccc;
          transition: .2s ease;
        }
        &:active {
          transform: scale(.9);
          transition: .2s ease;
        }
      }
    }
  }
  .empty {  
    color: rgb(138, 138, 138);
  }
  .modal {
      min-width: 250px;
      min-height: 150px;
      box-shadow: 0 0 3px #ccc;
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      background: #fff;
      padding: 15px;
      .title {
          font-size: 16px;
          font-weight: bold;
      }
      .input {
          position: relative;
          display: flex;
          justify-content: center;
          input {
              padding: 4px 8px;
              text-align: center;
          }
          .error {
              position: absolute;
              font-size: 10px;
              bottom: 0;
              transform: translateY(120%);
              color: rgb(216, 125, 125);
          }
      }
      .buttons {
          width: 100%;
          display: flex;
          justify-content: space-around;
          button {
              width: 50px;
              cursor: pointer;
              height: 25px;
              font-size: 12px;
              border: 1px solid black;
              border-radius: 0;
              transition: .3s ease;
          }
          .close {
              &:hover {
                  transition: .3s ease;
                  background-color: rgba(216, 125, 125, .5);
              }
          }
          .add {
              &:hover {
                  transition: .3s ease;
                  background-color: rgba(158, 216, 125, 0.5);
              }
          }
      }
  }
}
</style>