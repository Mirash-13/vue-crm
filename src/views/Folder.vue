<template>
  <div class="folder">
    <template v-if="!notFound">
      <div class="header">
        <div class="title">
          {{ folder.title }}
        </div>

        <div class="actions">
          <input type="search" v-model="search" >
          <button @click="showModal = true">дод. папку</button>
          <!-- <v-button @click.native="showModal = true" :style="{
              height: '120%',
              width: '90px',
              fontSize: '12px'
            }"
          >
            дод. людину
          </v-button> -->
        </div>
      </div>

      <div class="list">
        <table class="content-table" :style="{ '--column-count': tableHeader.length }">
          <thead>
            <tr>
              <th v-for="item in tableHeader"
                :key="`table_header_${item.obj}`"
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
            <tr v-for="person in sortedPerson"
              :key="`person_tr_${person.id}`"
              @click="openPerson(person.id)"
            >
              <td>{{ person.id }}</td>
              <td>{{ person.name }}</td>
              <td>{{ person.career }}</td>
              <td>{{ person.birth_date }}</td>
              <td>{{ person.summ_for_hour }}</td>
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
              <div class="title">Додавання робочого</div>
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
                  <label for="date">Рік:</label>
                  <input type="number" v-model="person.birth_date" id="date">
                </div>

                <div class="item date">
                  <label for="summ">Зарплата за годину:</label>
                  <input type="number" v-model="person.summ_for_hour" id="summ">
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
                  <button class="close" @click="showModal = false">закрити</button>
                  <button class="add" @click="addPerson">додати</button>
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
  name: 'Folder',
  data: () => ({
    tableHeader: [
      { name: "ID", obj: "id", type: "string", order: "top" },
      { name: "Ім'я", obj: "name", type: "string", order: "top" },
      { name: "Професія", obj: "career", type: "string", order: "top" },
      { name: "Рік", obj: "birth_date", type: "number", order: "top" },
      { name: "Зарплата за годину", obj: "summ_for_hour", type: "number", order: "top" },
      { name: "Паспорт", obj: "serial_number", type: "string", order: "top" },
    ],
    typeOfSort: { name: "Ім'я", obj: "name", type: "string", order: "top" },
    notFound: false,
    search: "",
    folder: {},
    showModal: false,
    person: { name: "", serial_number: "", birth_date: "", career: "", summ_for_hour: "" },
    error: "",
  }),
  methods: {
    ...mapMutations(["createPerson"]),
    queryFolder(name) {
      let folder = this.folders.filter(folder => folder.title === name)
      if ( folder[0] ) {
        this.notFound = false
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
    addPersonDB(data) {
      return new Promise((resolve, reject) => {
        fetch(`${this.uri}/workers/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
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
    addPerson() {
      const { name, serial_number, birth_date, career } = this.person
      if ( name.length && serial_number.length && birth_date.length && career.length ) {
          if ( !this.folder.people.filter(person => person.name === name).length ) {
            let person = JSON.parse(JSON.stringify(this.person))
            person.folder_id = this.folder.id

            this.addPersonDB(person)
            .then((data) => {
              data.prepayments = []
              this.createPerson({ person: data, folderName: this.folderName })
  
              this.showModal = false
  
              this.person.name = ""
              this.person.serial_number = ""
              this.person.birth_date = ""
              this.person.career = ""
            })
            .catch(err => {
              console.error(err)
            })
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
    ...mapGetters(['folders', 'uri']),
    sortedPerson() {
      if ( this.folder.people ) {
        let people = this.folder.people.filter(person => (
          person.name.toLowerCase().trim().includes(this.search.toLowerCase().trim()) ||
          person.career.toLowerCase().trim().includes(this.search.toLowerCase().trim()) ||
          person.birth_date.toString().toLowerCase().trim().includes(this.search.toLowerCase().trim()) ||
          person.serial_number.toLowerCase().trim().includes(this.search.toLowerCase().trim()) 
        ))

        if ( this.typeOfSort.type === 'number' ) {
          people.sort((a,b) => b[this.typeOfSort.obj] > a[this.typeOfSort.obj]);
          people = this.typeOfSort.order === 'down' ? people.reverse() : people
        } else if ( this.typeOfSort.type === 'string' ) {
          people.sort((a, b) => `${a[this.typeOfSort.obj]}`.localeCompare(`${b[this.typeOfSort.obj]}`))
          people = this.typeOfSort.order === 'down' ? people.reverse() : people
        }

        return people
      } else {
        return []
      }
    },
  },
  watch: {
    folderName(val) {
      this.queryFolder(val)
    },
    folders() {
      this.queryFolder(this.$route.params.folder)
    }
  },
  props: {
    folderName: String
  },
  mounted() {
    this.queryFolder(this.$route.params.folder)
  },
  components: {
    ModalWindow,
  }
};
</script>

<style lang="scss" scoped>

</style>