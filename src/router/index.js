import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Folders',
    component: () => import('../views/Folders.vue')
  },
  {
    path: '/folder/:folder',
    name: 'Folder',
    props: (route) => ({ folderName: route.params.folder }),
    component: () => import('../views/Folder.vue')
  },
  {
    path: '/person',
    name: 'Person',
    component: () => import('../views/Person.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
