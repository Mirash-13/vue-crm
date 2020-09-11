<template>
  <div class="folder">
    <div class="header">
      <div class="title">
        Всі папки
      </div>

      <div class="actions">
        <input type="search" v-model="search">
        <button @click="showModal = true">дод. папку</button>
      </div>
    </div>

    <div class="list">
      <table class="content-table" :style="{ '--column-count': tableHeader.length, '--main-color': mainColor }">
        <thead>
          <tr>
            <th v-for="item in tableHeader"
              :key="`folder_list_${item.obj}`"
            >
              <span class="text" @click="changeSort(item)">
                {{ item.name }}
                
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
            <td>{{ folder.id }}</td>
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
                    <div class="title">Додавання папки</div>

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
                        <button class="close" @click="showModal = false">закрити</button>
                        <button class="add" @click="addFolder">додати</button>
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
      error: "",
      tableHeader: [
      { name: "ID", obj: "id", type: "string", order: "top" },
      { name: "Назва", obj: "title", type: "string", order: "top" },
      { name: "Дата", obj: "time", type: "date", order: "top" },
    ],
    typeOfSort: { name: "Назва", obj: "title", type: "string", order: "top" },
    folder: { title: "" },
  }),
  methods: {
      ...mapMutations(['createFolder']),
      addFolderDB(title) {
        return new Promise((resolve, reject) => {
          fetch(`${this.uri}/folders/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
          })
          .then(res => res.text())
          .then((data) => {
            try {
              resolve(JSON.parse(data))
            } catch(err) {
              reject(err)
            }
          })
        });
      },
      addFolder() {
          const { title } = this.folder
          if ( title.length ) {
              if ( !this.folders.filter(folder => folder.title === title).length  ) {
                this.addFolderDB(title)
                .then(({ title, time, id }) => {
                  this.createFolder({ title, date: time, id, people: [] })

                  this.showModal = false

                  this.folder.title = ""
                })
                .catch(err => {
                  console.error(err)
                })
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
    ...mapGetters(['folders', 'uri', 'mainColor']),
    sortedFolders() {
      if ( this.folders ) {
        let folders = this.folders.filter(folder => (
          folder.title.toLowerCase().trim().includes(this.search.toLowerCase().trim()) ||
          folder.time.toLowerCase().trim().includes(this.search.toLowerCase().trim())
        ))

        if ( this.typeOfSort.type === 'date' ) {
          folders.sort((a,b) => new Date(b[this.typeOfSort.obj]) - new Date(a[this.typeOfSort.obj]));
          folders = this.typeOfSort.order === 'down' ? folders.reverse() : folders
        } else if ( this.typeOfSort.type === 'string' ) {
          folders.sort((a, b) => `${a[this.typeOfSort.obj]}`.localeCompare(`${b[this.typeOfSort.obj]}`))
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
  }
}
</script>

<style lang="scss" scoped>

</style>