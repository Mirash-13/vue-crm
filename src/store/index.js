import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    folders: [
      {
        name: "tankstu", people: [
          { name: "alex", passport: "pasdfsf22", job: "some job", date: "some date" },
          { name: "borat", passport: "pasdfsf22", job: "some job", date: "some date" },
          { name: "Garik", passport: "pasdfsf22", job: "some job", date: "some date" },
          { name: "alex2", passport: "pasdfsf22", job: "some job", date: "some date" },
          { name: "borat2", passport: "pasdfsf22", job: "some job", date: "some date" },
          { name: "Garik2", passport: "pasdfsf22", job: "some job", date: "some date" },
          { name: "alex3", passport: "pasdfsf22", job: "some job", date: "some date" },
          { name: "borat3", passport: "pasdfsf22", job: "some job", date: "some date" },
          { name: "Garik3", passport: "pasdfsf22", job: "some job", date: "some date" },
          { name: "alex4", passport: "pasdfsf22", job: "some job", date: "some date" },
          { name: "borat4", passport: "pasdfsf22", job: "some job", date: "some date" },
          { name: "Garik4", passport: "pasdfsf22", job: "some job", date: "some date" },
          { name: "alex5", passport: "pasdfsf22", job: "some job", date: "some date" },
          { name: "borat5", passport: "pasdfsf22", job: "some job", date: "some date" },
          { name: "Garik5", passport: "pasdfsf22", job: "some job", date: "some date" },
        ]
      },
      {
        name: "stomatologi", people: [
          { name: "John", passport: "pasdfsf22", job: "some job", date: "some date" },
          { name: "Amanda", passport: "pasdfsf22", job: "some job", date: "some date" }
        ]
      },
      {
        name: "shkolota", people: [
          { name: "alexsss", passport: "pasdfsf22", job: "some job", date: "some date" }
        ]
      },
    ]
  },
  getters: {
    folders: state => state.folders
  },
  mutations: {
    createFolder(state, folder) {
      state.folders.push(folder)
    },
    createPerson(state, { folderName, person }) {
      console.log(folderName)
      console.log(person)
      state.folders.filter(folder => folder.name === folderName)[0].people.push(person)
    }
  },
  actions: {
  },
  modules: {
  }
})
