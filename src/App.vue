<template>
  <div id="app" :style="{ '--main-color': mainColor }">
    <div class="header" @clickout.stop="show = false">
      <div class="burger">
        <button @click="showSidebar = !showSidebar"
          @clickout="showSidebar = mobileVersion ? false : true"
        >
          <span v-for="item in 3"
            :key="`burger_item_${item}`"
            :style="{ width: showSidebar ? '' : '100% !important' }"
          ></span>
        </button>
      </div>
        <div class="search" @clickout="show = false"
          @click="show = true"
          :style="{ marginLeft: showSidebar ? ( mobileVersion ? 'calc(50% / 2)' : '200px' ) : 'calc(50% / 2)' }"
        >
          <input type="search" v-model="search" :style="{ borderRadius: `4px 4px ${ sortedList.length && search && show ? '0 0' : '4px 4px'}` }">
          <transition name="show-search">
            <div class="search-container scroll" v-if="sortedList.length && search && show">
            <!-- <div class="search-container" v-show="sortedList.length"> -->
              <div class="container scroll">
                <div v-for="item in sortedList"
                  :key="`search_item_${item.type}_${item.id}`"
                  class="item"
                  @click="openPage(item)"
                >
                  <span class="content">
                    {{ item.title }}
                  </span>
                  <span class="title">
                    {{ item.type }}
                  </span>
                  <div class="folder-title" v-if="item.type === 'person'">
                    Папка: &ensp;
                    {{ item.folder_title }}
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div class="a-text">
          yyd
        </div>
    </div>
    
    <div class="body" @clickout.stop>
      <div class="nav"
        :style="{ width: showSidebar ? ( mobileVersion ? '50px' : '200px' ) : '50px' }"
        @clickout="showSidebar = mobileVersion ? false : true"
      >
        <navbar :showSidebar="showSidebar"></navbar>
      </div>

      <div class="folders" :style="{ width: showSidebar ? mobileVersion ? 'calc(100% - 50px)' : 'calc(100% - 200px)' : 'calc(100vw - 50px)' }">
        <transition name="change-page" appear mode="out-in">
          <router-view/>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import navbar from './views/Navbar'

export default {
  data: () => ({
    search: "",
    show: false,
    showSidebar: true,
    mobileVersion: false
  }),
  watch: {
    width(val) {
      if ( val <= 920 ) {
        this.showSidebar = false
        this.mobileVersion = true
      } else {
        this.mobileVersion = false
      }
    }
  },
  methods: {
    ...mapMutations(['setWidth']),
    openPage(item) {
      if ( item.type === 'folder' && this.$route.params.folder !== item.title ) {
        this.$router.push({ name: 'Folder', params: { folder: item.title } })
      } else if ( item.type === 'person' && this.$route.query.person !== item.title ) {
        this.$router.push({ name: 'Person', query: { person: item.title, folder: item.folder_title } })
      }
    },
    getWindowWidth() {
      this.setWidth(document.documentElement.clientWidth)
    },
  },
  computed: {
    ...mapGetters(['folders', 'mainColor', 'width']),
    sortedList() {
      let list = []

      this.folders.forEach(folder => {
        list.push({ title: folder.title, id: folder.id, type: 'folder' })
        folder.people.forEach(person => list.push({
          title: person.name,
          id: person.id,
          type: "person",
          folder_id: person.folder_id,
          folder_title: folder.title
          }
        ))
      })

      return list.filter(item => item.title.toLowerCase().trim().includes(this.search.toLowerCase().trim()))
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.getWindowWidth()
    })

    this.getWindowWidth()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowWidth);
  },
  components: {
    navbar,
  }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');

* {
  padding: 0;
  margin: 0;
  font-family: 'Syne', sans-serif;
  outline: none;
}
.modal-fade-enter, .modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
.content-table {
  border-collapse: collapse;
  font-size: .9em;
  // min-width: 700px;
  border-radius: 5px 5px 0 0;
  overflow: hidden !important;
  box-shadow: 0 0 20px rgba(0, 0, 0, .15);
  width: 100%;
  --main-color: #1D2D36;
  height: 100%;
  thead {
    background: black;
    color: #fff;
    tr {
      // background-color: var(--main-color);
      background-color: #1D2D36;
      color: #fff;
      text-align: left;
      font-weight: bold;
      text-align: center;
      display: flex;
    }
    .text {
      position: relative;
      cursor: pointer;
      user-select: none;
      display: flex;
      justify-content: center;
      align-items: center;
      .arrow {
        position: absolute;
        right: -24px;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: .3s ease;
        &::after {
          content: "";
          position: absolute;
          border: solid rgb(224, 217, 217);
          border-width: 0 2px 2px 0;
          display: inline-block;
          padding: 3px;
          transform: translate(-1px, -1px);
        }
      }
    }
  }
  tbody {
    display:block;
    width: 100%;
    overflow: auto;
    height: 100%;
    tr {
      border-bottom: 1px solid #ddd;
      transition: text-shadow .1s;
      display: flex;
      cursor: pointer;
      td {
        flex-grow: 1;
      }
      &:nth-of-type(even) {
        background-color: #f3f3f3;
      }
      &:last-of-type {
        border-bottom: 2px solid #1D2D36;
      }
      &:hover {
        text-shadow: 1px 0 black;
        color: #1D2D36;
      }
    }
  }
  th, td {
    padding: 12px 15px;
    flex-grow: 1;
    width: calc(100% / var(--column-count));
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  .item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    label {
      display: flex;
      padding-right: 10px;
      min-width: 80px;
      text-align: start;
    }
    input {
      text-align: center;
      width: 200px !important;
      height: 20px;
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
    .close {
      --main-color: rgb(214, 73, 73);
    }
  }
}

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
      font-size: 16px;
      font-weight: bold;
      display: flex;
      align-items: center;
    }
    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 25px;
      .dates {
        input {
          width: 30%;
          font-size: 12px;
          height: auto;
        }
      }
    }
  }
  .list {
    flex-grow: 1;
    margin: 25px 0;
    overflow-x: auto;
    border-radius: 5px 5px 0 0;
  }
  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .empty {  
    color: rgb(138, 138, 138);
  }
}

input {
  border: 1px solid #ccc;
  padding: 4px 8px;
  margin: 0 10px;
  height: 30px;
  font-size: 14px;
  width: 200px;
  transition: .3s ease;
  border-radius: 4px;
  &:focus {
    box-shadow: 0 0 4px var(--main-color);
    transition: .3s ease;
  }
}

button {
  height: 30px;
  width: 120px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  border: 1px solid var(--main-color);
  color: var(--main-color);
  background-color: #fff;
  transition: .2s ease;
  &:hover {
    background-color: var(--main-color);
    border: 1px solid var(--main-color);
    color: white;
    transition: .2s ease;
  }
  &:active {
    transform: scale(.9);
    transition: .2s ease;
  }
}

*::-webkit-scrollbar-button {  background-color: #1D2D36; height: 0; }
*::-webkit-scrollbar-track {  background-color: none;}
*::-webkit-scrollbar-track-piece { background-color: #ffffff; border-radius: 5px;}
*::-webkit-scrollbar-thumb { height: 10px; background-color: #333; border-radius: 3px;}
*::-webkit-scrollbar { width: 4px; height: 3px;}
*::-webkit-scrollbar-corner { background-color: #999;}
*::-webkit-resizer { background-color: #666;}

.show-search-enter-active {
  animation: show-search-in .5s;
  transform-origin: top;
}
.show-search-leave-active {
  animation: show-search-in .5s reverse;
  transform-origin: top;
}
@keyframes show-search-in {
  0% {
    transform: translateY(100%) scaleY(0);
  }
  50% {
    transform: translateY(100%) scaleY(1.3);
  }
  100% {
    transform: translateY(100%) scaleY(1);
  }
}

.change-page-enter, .change-page-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.change-page-enter-active, .change-page-leave-active {
  // transform: translateX(100%);
  transition: .3s ease;
}

@media only screen and (max-width: 600px) {
  .content-table {
    font-size: 12px;
  }
  .folder {
    .header {
      .title {
        font-size: 12px;
      }
    }
  }
  .search-container {
    span {
      font-size: 12px !important;
    }
  }
  input {
    padding: 3px 6px !important;
    margin: 0 8px !important;
    height: 20px !important;
    font-size: 10px !important;
    width: 140px !important;
  }
  button {
    height: 20px !important;
    width: 80px !important;
    font-size: 10px !important;
  }
}
@media only screen and (max-width: 500px) {
  .content-table {
    font-size: 10px;
    thead {
      .text {
        .arrow {
          width: 10px;
          height: 10px;
          right: auto;
          // left: 0;
          bottom: -11px;
          &:after {
            padding: 2px;
          }
        }
      }
    }
    th, td {
      padding: 6px 8px 12px 8px;
    }
  }
  .search-container {
    .item {
      height: 30px !important;
      span, div {
        font-size: 10px !important;
      }
    }
  }
}
@media only screen and (max-width: 420px) {
  .folder {
    .header {
      .title {
        font-size: 10px;
      }
    }
  }
  input {
    padding: 3px 6px !important;
    margin: 0 8px !important;
    height: 20px !important;
    font-size: 10px !important;
    width: 80px !important;
  }
  button {
    height: 20px !important;
    width: 60px !important;
    font-size: 10px !important;
  }
  .search-container {
    .item {
      span, div {
        font-size: 8px !important;
      }
    }
  }
  .modal {
    .item {
      input {
        width: 140px !important;
      }
    }
  }
}
@media only screen and (max-width: 350px) {
  .modal {
    min-width: 200px;
    .item {
      input {
        width: 100px !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #333;
  color: white;
  .header {
    height: 10vh;
    display: flex;
    align-items: center;
    position: relative;
    .burger {
      position: absolute;
      display: flex;
      justify-content: center;
      width: 50px;
      left: 0;
      button {
        border: none;
        background: none;
        max-width: 5vw;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
        height: 18px;
        width: 30px;
        span {
          width: 100%;
          height: 2px;
          background: white;
          transition: all .3s ease;
          &:nth-child(2n) {
            width: 75%;
            transition: all .3s ease;
          }
          &:nth-child(3n) {
            width: 50%;
            transition: all .3s ease;
          }
        }
      }
    }
    .search {
      width: calc((100% - 200px) / 2);
      min-width: 50%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all .3s ease;
      input {
        width: 100% !important;
        margin: 0 !important;
      }
      .search-container {
        position: absolute;
        bottom: 0;
        box-shadow: 0 0 3px #6b6b6b;
        transform: translateY(100%);
        width: 100%;
        border-radius: 0 0 12px 12px;
        max-height: 240px;
        background: rgb(255, 255, 255);
        color: #53595e;
        z-index: 9;
        overflow: hidden;
        .container {
          overflow: auto;
          max-height: inherit;
        }
        .item {
          display: flex;
          position: relative;
          height: 50px;
          align-items: center;
          cursor: pointer;
          box-shadow: 2px 0 2px rgb(100, 100, 100);
          .content {
            font-weight: bold;
            font-size: 14px;
            margin-left: 40px;
          }
          .title {
            font-size: 12px;
            top: 2px;
            left: 4px;
            position: absolute;
          }
          .folder-title {
            position: absolute;
            right: 0;
            left: 50%;
            max-height: 50%;
            overflow-x: auto;
            font-size: 12px;
          }
          &:hover {
            background: rgb(233, 233, 233);
            font-weight: bold;
            transition: .2s ease;
            .content {
              color: rgb(0, 0, 0);
            }
          } 
        }
      }
    }
    .a-text {
      position: absolute;
      color: #ccc;
      right: 10px;
    }
  }
  .body {
    display: flex;
    width: 100%;
    height: 90vh;
    .nav {
      width: 200px;
      transition: all .3s ease;
      min-width: 50px;
      position: relative;
    }
    .folders {
      width: calc(100% - 200px);
      transition: all .3s ease;
    }
  }
}
</style>
