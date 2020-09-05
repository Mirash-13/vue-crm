import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    folders: [
      {
        name: "tankstu", date: "1999-10-10", people: [
          { name: "alex", passport: "pasdfsf22", job: "some job", date: "1999-09-29" },
          { name: "borat", passport: "pasdfsf22", job: "some job", date: "1999-09-11" },
          { name: "Garik", passport: "pasdfsf22", job: "some job", date: "1999-09-12" },
          { name: "alex2", passport: "pasdfsf22", job: "some job", date: "1999-02-11" },
          { name: "borat2", passport: "pasdfsf22", job: "some job", date: "1999-02-11" },
          { name: "Garik2", passport: "pasdfsf22", job: "some job", date: "1999-09-21" },
          { name: "alex3", passport: "pasdfsf22", job: "some job", date: "1999-09-11" },
          { name: "borat3", passport: "pasdfsf22", job: "some job", date: "1999-09-11" },
          { name: "Garik3", passport: "pasdfsf22", job: "some job", date: "1999-09-01" },
          { name: "alex4", passport: "pasdfsf22", job: "some job", date: "1999-09-11" },
          { name: "borat4", passport: "pasdfsf22", job: "some job", date: "1999-09-11" },
          { name: "Garik4", passport: "pasdfsf22", job: "some job", date: "1999-09-30" },
          { name: "alex5", passport: "pasdfsf22", job: "some job", date: "1999-09-11" },
          { name: "borat5", passport: "pasdfsf22", job: "some job", date: "1999-02-11" },
          { name: "Garik5", passport: "pasdfsf22", job: "some job", date: "1999-09-11" },
        ]
      },
      {
        name: "stomatologi", date: "2013-02-10", people: [
          { name: "John", passport: "pasdfsf22", job: "some job", date: "some date" },
          { name: "Amanda", passport: "pasdfsf22", job: "some job", date: "some date" }
        ]
      },
      {
        name: "shkolota", date: "2002-09-10", people: [
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
