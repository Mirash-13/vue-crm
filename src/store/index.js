import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    uri: 'http://127.0.0.1:8000/db',
    folders: [],
    width: 0,
    mainColor: '#007bff'
  },
  getters: {
    folders: state => state.folders,
    uri: state => state.uri,
    mainColor: state => state.mainColor,
    width: state => state.width,
  },
  mutations: {
    setWidth(state, width) {
      state.width = width
    },
    createFolder(state, folder) {
      state.folders.push(folder)
    },
    setFolders(state, folders) {
      state.folders = folders
    },
    closePayment(state, { folderTitle, personId }) {
      let folders = state.folders
      let folder = state.folders.filter(folder => folder.title === folderTitle)[0]
      let person = folder.people.filter(person => person.id === personId)[0]
      person.prepayments.forEach(payment => payment.closed = true)

      state.folders = folders
    },
    createPerson(state, { folderName, person }) {
      state.folders.filter(folder => folder.title === folderName)[0].people.push(person)
    },
    addPayment(state, { folderTitle, personId, payment }) {
      let folders = state.folders
      let folder = state.folders.filter(folder => folder.title === folderTitle)[0]
      let person = folder.people.filter(person => person.id === personId)[0]
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
