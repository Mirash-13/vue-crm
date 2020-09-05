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
      state.folders.push(folder)
    },
    setFolders(state, folders) {
      state.folders = folders
      console.log(state.folders)
    },
    createPerson(state, { folderName, person }) {
      state.folders.filter(folder => folder.title === folderName)[0].people.push(person)
    }
  },
  actions: {
  },
  modules: {
  }
})
