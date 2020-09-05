import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    uri: 'http://127.0.0.1:8000/db',
    folders: [
      // {
      //   name: "shkolota", date: "2002-09-10", people: [
      //     { name: "alexsss", passport: "pasdfsf22", job: "some job", date: "some date" }
      //   ]
      // },
    ]
  },
  getters: {
    folders: state => state.folders,
    uri: state => state.uri,
  },
  mutations: {
    createFolder(state, folder) {
      folder.id = Math.random().toString(36).substr(2, 9)
      state.folders.push(folder)
    },
    setFolders(state, folders) {
      state.folders = folders
    },
    createPerson(state, { folderName, person }) {
      person.prepayments = []
      person.id = Math.random().toString(36).substr(2, 9)
      state.folders.filter(folder => folder.title === folderName)[0].people.push(person)
    },
    addPayment(state, { folderTitle, personName, payment }) {
      payment.id = Math.random().toString(36).substr(2, 9)
      let folders = state.folders
      let folder = state.folders.filter(folder => folder.title === folderTitle)[0]
      let person = folder.people.filter(person => person.name === personName)[0]
      if ( person.prepayments == undefined ) {
        person.prepayments = []
      }
      person.prepayments.push(payment)

      state.folders = folders
    }
  },
  actions: {
  },
  modules: {
  }
})
