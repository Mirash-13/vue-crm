<template>
  <div id="app">
    <div class="header">
        <input class="search" type="search">
        <div class="a-text">
          yyd
        </div>
    </div>
    
    <div class="body">
      <div class="nav">
        <navbar></navbar>
      </div>

      <div class="folders">
        <router-view/>
      </div>
    </div>
    <!-- <router-link to="/">Home</router-link> | -->
  </div>
</template>

<script>
import navbar from './views/Navbar'

export default {
  components: {
    navbar,
  }
}
</script>>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap');

* {
  padding: 0;
  margin: 0;
  font-family: 'Ubuntu';
}
.modal-fade-enter, .modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
.content-table {
  border-collapse: collapse;
  width: 400px;
  table-layout: fixed;
  font-size: .9em;
  min-width: 400px;
  border-radius: 5px 5px 0 0;
  overflow: hidden !important;
  box-shadow: 0 0 20px rgba(0, 0, 0, .15);
  thead {
    background: black;
    color: #fff;
    tr {
      background-color: var(--main-color);
      color: #fff;
      text-align: left;
      font-weight: bold;
      text-align: center;
      display: block;
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
      &:nth-of-type(even) {
        background-color: #f3f3f3;
      }
      &:last-of-type {
        border-bottom: 2px solid var(--main-color);
      }
      &:hover {
        text-shadow: 1px 0 black;
        color: var(--main-color);
      }
    }
  }
  th, td {
    padding: 12px 15px;
    width: 200px;
  }
}
.scroll::-webkit-scrollbar-button {  background-color: #1D2D36; height: 0; }
.scroll::-webkit-scrollbar-track {  background-color: none;}
.scroll::-webkit-scrollbar-track-piece { background-color: #ffffff; border-radius: 5px;}
.scroll::-webkit-scrollbar-thumb { height: 10px; background-color: #333; border-radius: 3px;}
.scroll::-webkit-scrollbar { width: 4px; height: 3px;}
.scroll::-webkit-scrollbar-corner { background-color: #999;}
.scroll::-webkit-resizer { background-color: #666;}
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
    .search {
      width: calc(75vw / 2);
      border-radius: 10px;
      border: 1px solid black;
      font-size: 14px;
      margin-left: 25vw;
      padding: 4px 8px;
      background: rgb(218, 217, 217);
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
      width: 25vw;
    }
    .folders {
      width: 75vw;
    }
  }
}
</style>
