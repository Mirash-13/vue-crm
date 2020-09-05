<template>
  <div class="folder">
    <div class="header">
      <div class="title">
        Всі папки
      </div>

      <div class="actions">
        <input type="search" v-model="search">
        <v-button @click.native="showModal = true" :style="{
              height: '120%',
              width: '90px',
              fontSize: '12px'
            }"
          >
            дод. папку
          </v-button>
      </div>
    </div>

    <div class="list">
      <table class="content-table">
        <thead>
          <tr>
            <th v-for="item in tableHeader"
              :key="`folder_list_${item.obj}`"
            >
              <span class="text" @click="changeSort(item)">
                {{ item.obj }}
                
                <div v-if="typeOfSort.obj === item.obj"
                  :style="{
                    transform: `rotate(${ typeOfSort.order === 'top' ? 225 : 45 }deg)`
                  }"
                  class="arrow"
                ></div>
              </span>
            </th>
          </tr>
        </thead>
        <tbody class="scroll">
          <tr v-for="folder in sortedFolders" :key="`folder_tr_${folder.id}`" @click="openFolder(folder.title)">
            <td>{{ folder.title }}</td>
            <td>{{ folder.time | handleDate}}</td>
          </tr>
        </tbody>
      </table>

      <div class="empty" v-if="!sortedFolders.length">
          пусто
      </div>
    </div>

    <transition name="modal-fade">
        <ModalWindow @clickOutside="(close) => showModal === true ? showModal = close : showModal = showModal"
            v-if="showModal"
        >
            <template #modal>
                <div class="modal">
                    <div class="title">Введіть назву</div>

                    <div class="input">
                      <div class="item name">
                        <label for="name">Ім'я:</label>
                        <input type="text" maxlength="25" v-model="folder.title" id="name">
                        <div class="error">
                            {{ error }}
                        </div>
                      </div>
                    </div>

                    <div class="buttons">
                        <v-button :style="{ background: 'linear-gradient(90deg, #bd5252, #f0aaaa)' }" @click.native="showModal = false">закрити</v-button>
                        <v-button @click.native="addFolder">додати</v-button>
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
import VButton from '../components/VButton'

export default {
  name: 'Folders',
  data: () => ({
      search: "",
      showModal: false,
      error: "",
      tableHeader: [
      { obj: "Назва", type: "string", order: "top" },
      { obj: "Дата", type: "date", order: "top" },
    ],
    typeOfSort: { obj: "Назва", type: "string", order: "top" },
    folder: { title: "" },
  }),
  methods: {
      ...mapMutations(['createFolder']),
      addFolder() {
          const { title } = this.folder
          if ( title.length ) {
              if ( !this.folders.filter(folder => folder.title === title).length  ) {
                this.createFolder({ title, date: new Date(), people: [] })

                this.showModal = false

                this.folder.title = ""
              } else {
                  this.setError("папка з таким ім'ям вже існує")
              }
          } else {
            this.setError("всі поля повинні бути заповнені")
          }
      },
      openFolder(folder) {
        if ( this.$route.params.folder !== folder ) {
          this.$router.push({ name: 'Folder', params: { folder: folder } })
        }
      },
      setError(text) {
        this.error = text
        setTimeout(() => {
            this.error = ""
        }, 5000)
      },
      changeSort(typeOfSort) {
        if ( this.typeOfSort.obj === typeOfSort.obj ) {
          this.typeOfSort.order = this.typeOfSort.order === 'top' ? 'down' : 'top'
        } else {
          typeOfSort.order = 'top'
          this.typeOfSort = typeOfSort
        }
      },
  },
  filters: {
    handleDate(val) {
      return new Date(val).toDateString()
    }
  },
  computed: {
    ...mapGetters(['folders']),
    sortedFolders() {
      if ( this.folders ) {
        let folders = this.folders.filter(folder => (
          folder.title.toLowerCase().trim().includes(this.search.toLowerCase().trim()) ||
          folder.time.toLowerCase().trim().includes(this.search.toLowerCase().trim())
        ))

        if ( this.typeOfSort.type === 'date' ) {
          folders.sort((a,b) => new Date(b.time) - new Date(a.time));
          folders = this.typeOfSort.order === 'down' ? folders.reverse() : folders
        } else if ( this.typeOfSort.type === 'string' ) {
          folders.sort((a, b) => a.title.localeCompare(b.title))
          folders = this.typeOfSort.order === 'down' ? folders.reverse() : folders
        }

        return folders
      } else {
        return []
      }
    }
  },
  components: {
      ModalWindow,
      VButton
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
  padding: 10px;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  .list {
    flex-grow: 1;
    margin: 25px 0;
  }
  .empty {  
    color: rgb(138, 138, 138);
  }
}
</style>