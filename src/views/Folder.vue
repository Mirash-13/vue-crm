<template>
  <div class="folder">
    <template v-if="!notFound">
      <div class="header">
        <div class="title">
          {{ folder.name }}
        </div>

        <div class="actions">
          <input type="search" v-model="search" >
          <button @click="showModal = true">add person</button>
        </div>
      </div>

      <div class="list">
        <table class="content-table">
          <thead>
            <tr>
              <th @click="changeSort('string')">Name</th>
              <th @click="changeSort('string')">Job</th>
              <th @click="changeSort('date')">Date</th>
              <th @click="changeSort('string')">Passport</th>
            </tr>
          </thead>
          <tbody class="scroll">
            <tr v-for="person in sortedPerson" :key="`person_tr_${person.name}`" @click="openPerson(person.name)">
              <td>{{ person.name }}</td>
              <td>{{ person.job }}</td>
              <td>{{ person.date }}</td>
              <td>{{ person.passport }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <div class="not-found" v-else>
      not found
    </div>

    <transition name="modal-fade">
        <ModalWindow @clickOutside="(close) => showModal === true ? showModal = close : showModal = showModal"
            v-if="showModal"
        >
            <template #modal>
                <div class="modal">
                    <div class="title">Input person info</div>

                    <div class="input">
                      <div class="item name">
                        <label for="name">Name:</label>
                        <input type="text" maxlength="25" v-model="person.name" id="name">
                      </div>

                      <div class="item passport">
                        <label for="passport">Passport:</label>
                        <input type="text" maxlength="25" v-model="person.passport" id="passport">
                      </div>

                      <div class="item date">
                        <label for="date">Date:</label>
                        <input type="date" v-model="person.date" id="date">
                      </div>

                      <div class="item job">
                        <label for="job">Job:</label>
                        <input type="text" maxlength="25" v-model="person.job">
                        <div class="error">
                            {{ error }}
                        </div>
                      </div>
                    </div>

                    <div class="buttons">
                        <button class="close" @click="showModal = false">close</button>
                        <button class="add" @click="addPerson">add</button>
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
    notFound: false,
    folder: {},
    search: "",
    showModal: false,
    person: { name: "", passport: "", date: "", job: "" },
    error: "",
    typeOfSort: "string top"
  }),
  methods: {
    ...mapMutations(["createPerson"]),
    queryFolder(name) {
      let folder = this.folders.filter(folder => folder.name === name)
      if ( folder[0] ) {
        this.folder = folder[0]
      } else {
        this.notFound = true
      }
    },
    openPerson(person) {
      if ( this.$route.params.person !== person ) {
        this.$router.push({ path: 'Person', params: { person: person } })
      }
    },
    addPerson() {
      const { name, passport, date, job } = this.person
      if ( name.length && passport.length && date.length && job.length ) {
          if ( !this.folder.people.filter(person => person.name === name).length ) {
              this.createPerson({ person: JSON.parse(JSON.stringify(this.person)), folderName: this.folderName })

              this.showModal = false

              this.person.name = ""
              this.person.passport = ""
              this.person.date = ""
              this.person.job = ""
          } else {
              this.setError("the person already exist")
          }
      } else {
        this.setError('all fields must be filled')
      }
    },
    setError(text) {
      this.error = text
      setTimeout(() => {
          this.error = ""
      }, 5000)
    },
    changeSort(typeOfSort) {
      if ( this.typeOfSort.includes(typeOfSort) ) {
        if ( this.typeOfSort.includes('top') ) {
          this.typeOfSort = `${typeOfSort} down`
        } else {
          this.typeOfSort = ""
        }
      } else {
        this.typeOfSort = `${typeOfSort} top`
      }
    }
  },
  computed: {
    ...mapGetters(['folders']),
    sortedPerson() {
      if ( this.folder.people ) {
        let people = this.folder.people.filter(person => (
          person.name.toLowerCase().trim().includes(this.search.toLowerCase().trim()) ||
          person.job.toLowerCase().trim().includes(this.search.toLowerCase().trim()) ||
          person.date.toLowerCase().trim().includes(this.search.toLowerCase().trim()) ||
          person.passport.toLowerCase().trim().includes(this.search.toLowerCase().trim()) 
        ))

        if ( this.typeOfSort.includes('date') ) {
          console.log('date')
          console.log(this.typeOfSort.includes('top') ? 'top' : 'down')
        } else if ( this.typeOfSort.includes('string') ) {
          console.log('string')
          console.log(this.typeOfSort.includes('top') ? 'top' : 'down')
        }
        // people.sort((a, b) => a.name.localeCompare(b.name))

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
    table {
      width: 100%;
      --main-color: #1D2D36;
      height: 100%;
      tbody {
        tr {
          cursor: pointer;
        }
      }
    }
  }
  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
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
          margin-bottom: 15px;
      }
      .item {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 15px;
        label {
          display: flex;
          padding-right: 10px;
          width: 80px;
        }
        input {
          padding: 4px 8px;
          text-align: center;
          width: 200px;
        }
        .error {
          position: absolute;
          font-size: 10px;
          bottom: 0;
          transform: translateY(150%);
          color: rgb(216, 125, 125);
          left: 0;
          right: 0;
        }
        &:last-child {
          margin-bottom: 25px;
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