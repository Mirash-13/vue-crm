<template>
    <a href="#" @click="showAnimathion" :style="buttonStyle">
        <slot>
            button
        </slot>

        <span v-for="one in arr"
            :key="`one_${one.id}`"
            :style="{
                left: `${one.left}px`,
                top: `${one.top}px`
            }"
        ></span>
    </a>
</template>

<script>
export default {
    name: "Button",
    data: () => ({
        arr: []
    }),
    methods: {
        showAnimathion(e) {
            let id = Math.random().toString(36).substr(2, 9)
            let left = e.clientX - e.target.offsetLeft
            let top = e.clientY - e.target.offsetTop

            this.arr.push({ id, left, top })

            setTimeout(() => {
                this.arr.splice(this.arr.findIndex(item => item.id === id), 1)
            }, 1000)
        }
    },
    props: {
        buttonStyle: Object
    }
}
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
}
a {
    position: relative;
    display: flex;
    color: #fff;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    border-radius: 40px;
    font-size: 14px;
    width: 100px;
    height: 35px;
    padding: 0;
    margin: 0;
    overflow: hidden;
    background: linear-gradient(90deg, #66686b, #c2c9ca);
    // background: linear-gradient(90deg, #755bea, #ff72c0);
    &:hover {
        text-decoration: underline;
    }
    span {
        position: absolute;
        background: #fff;
        transform: translate(-50%, -50%);
        pointer-events: none;
        border-radius: 50%;
        animation: animate 1s linear infinite;
    }
}
@keyframes animate {
    0% {
        width: 0;
        height: 0;
        opacity: .5;
    }
    100% {
        width: 500px;
        height: 500px;
        opacity: 0;
    }
}
</style>