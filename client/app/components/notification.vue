<template lang="pug">
    div(role="notification")
        div(role="contentinfo", :class="item.type", v-if="item.type === 'success'")
          svg: use(:xlink:href="require('../assets/sprites/icon-check-48.svg')")
          h3 {{ title }}
          p {{  description }}


        div(role="contentinfo", :class="item.type", v-if="item.type !== 'success'")
          | {{ content }}

</template>

<script>
    export default {
        props: ['item'],

        computed: {
            title () {
                return this.item.params.msg
            },

            eventName () {
                return this.item.params.event
            },

            description () {
                if ('account.add.success' === this.eventName) {
                    return `Retrouvez vos données dans l'application Files à l'emplacement : ${this.item.params.account.folderPath}`
                }
            },

            content () {
                return this.item.params.msg
            }
        }
    }
</script>

<style lang="stylus">
    @import '../styles/base/_colors'

    [role='notification']
        position fixed
        z-index 1000

        left 0
        right 0

        display flex
        align-items center
        justify-content center

        [role="contentinfo"]
            flex 0 1 34rem

            margin 1em
            padding 0.7em 1.15em
            border-radius 0.7em

            p
                margin: 0
                padding: 0

            h3
                font-size: 1.25em
                margin: 0 0 0.25em

            &.success
                background $green
                color white

                svg
                    width: 3em
                    height: 3em
                    margin-right: 1em
                    float: left

            &.error
                background $red
                color white
</style>
