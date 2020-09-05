<template>
  <div class="folder">
    <template v-if="!notFound">
      <div class="header">
        <div class="title">
          {{ folder.title }}
        </div>

        <div class="actions">
          <input type="search" v-model="search" >
          <v-button @click.native="showModal = true" :style="{
              height: '120%',
              width: '90px',
              fontSize: '12px'
            }"
          >
            дод. людину
          </v-button>
        </div>
      </div>

      <div class="list">
        <table class="content-table">
          <thead>
            <tr>
              <th v-for="item in tableHeader"
                :key="`table_header_${item.obj}`"
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
            <tr v-for="person in sortedPerson" :key="`person_tr_${person.id}`" @click="openPerson(person.name)">
              <td>{{ person.name }}</td>
              <td>{{ person.career }}</td>
              <td>{{ person.birth_date }}</td>
              <td>{{ person.serial_number }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <div class="not-found" v-else>
      не знайдено
    </div>

    <transition name="modal-fade">
        <ModalWindow @clickOutside="(close) => showModal === true ? showModal = close : showModal = showModal"
            v-if="showModal"
        >
          <template #modal>
            <div class="modal">
              <div class="title">Введіть дані: </div>
              <div class="input">
                <div class="item name">
                  <label for="name">Ім'я:</label>
                  <input type="text" maxlength="25" v-model="person.name" id="name">
                </div>

                <div class="item passport">
                  <label for="passport">Паспорт:</label>
                  <input type="text" maxlength="25" v-model="person.serial_number" id="passport">
                </div>

                <div class="item date">
                  <label for="date">Дата:</label>
                  <input type="date" v-model="person.birth_date" id="date">
                </div>

                <div class="item job">
                  <label for="job">Професія:</label>
                  <input type="text" maxlength="25" v-model="person.career">
                  <div class="error">
                      {{ error }}
                  </div>
                </div>
              </div>

              <div class="buttons">
                  <v-button :style="{ background: 'linear-gradient(90deg, #bd5252, #f0aaaa)' }" @click.native="showModal = false">закрити</v-button>
                  <v-button @click.native="addPerson">додати</v-button>
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
  name: 'Folder',
  data: () => ({
    tableHeader: [
      { obj: "Ім'я", type: "string", order: "top" },
      { obj: "Професія", type: "string", order: "top" },
      { obj: "Дата", type: "date", order: "top" },
      { obj: "Паспорт", type: "string", order: "top" }
    ],
    typeOfSort: { obj: "Ім'я", type: "string", order: "top" },
    notFound: false,
    folder: {},
    search: "",
    showModal: false,
    person: { name: "", serial_number: "", birth_date: "", career: "" },
    error: "",
  }),
  methods: {
    ...mapMutations(["createPerson"]),
    queryFolder(name) {
      let folder = this.folders.filter(folder => folder.title === name)
      if ( folder[0] ) {
        this.folder = folder[0]
      } else {
        this.notFound = true
      }
    },
    openPerson(person) {
      if ( this.$route.query.person !== person ) {
        this.$router.push({ name: 'Person', query: { person: person, folder: this.folder.title } })
      }
    },
    addPerson() {
      const { name, serial_number, birth_date, career } = this.person
      if ( name.length && serial_number.length && birth_date.length && career.length ) {
          if ( !this.folder.people.filter(person => person.name === name).length ) {
            this.createPerson({ person: JSON.parse(JSON.stringify(this.person)), folderName: this.folderName })

            this.showModal = false

            this.person.name = ""
            this.person.serial_number = ""
            this.person.birth_date = ""
            this.person.career = ""
          } else {
              this.setError("людина під цим іменем вже існує")
          }
      } else {
        this.setError('всі поля повинні бути заповнені')
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
    }
  },
  computed: {
    ...mapGetters(['folders']),
    sortedPerson() {
      if ( this.folder.people ) {
        let people = this.folder.people.filter(person => (
          person.name.toLowerCase().trim().includes(this.search.toLowerCase().trim()) ||
          person.career.toLowerCase().trim().includes(this.search.toLowerCase().trim()) ||
          person.birth_date.toLowerCase().trim().includes(this.search.toLowerCase().trim()) ||
          person.serial_number.toLowerCase().trim().includes(this.search.toLowerCase().trim()) 
        ))

        if ( this.typeOfSort.type === 'date' ) {
          people.sort((a,b) => b.birth_date - a.birth_date);
          people = this.typeOfSort.order === 'down' ? people.reverse() : people
        } else if ( this.typeOfSort.type === 'string' ) {
          people.sort((a, b) => a.name.localeCompare(b.name))
          people = this.typeOfSort.order === 'down' ? people.reverse() : people
        }

        return people
      } else {
        return []
      }
    },
    folderName() {
      return this.$route.params.folder
    }
  },
  watch: {
    folderName(val) {
      this.queryFolder(val)
    }
  },
  mounted() {
    this.queryFolder(this.$route.params.folder)
  },
  components: {
    ModalWindow,
    VButton
  }
};
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
    }
  }
  .list {
    flex-grow: 1;
    margin: 25px 0;
  }
  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
</style>