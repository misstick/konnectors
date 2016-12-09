<template lang="pug">
    div(aria-hidden="false" role="dialog")
        div(role="separator" @click="close")
        .wrapper
            div(role="contentinfo")
                header(:style="headerStyles")
                    a(:href="closeURL" @click="close" role="close")
                        svg: use(:xlink:href="require('../assets/sprites/icon-close-32.svg')")

                    slot(name="header"): svg: use(:xlink:href="iconPath")

                slot

                footer: slot(name="footer")
</template>

<script>
    import Vue from 'vue'

    export default {
        props: ['id', 'headerStyles', 'hub', 'item'],

        created () {
            this.hub.$on('close', this.close)
            this.hub.$on('success', this.success)
            this.hub.$on('error', this.error)
        },

        computed: {
            closeURL () {
                let query = []

                for (let name in this.closeQuery) {
                    query.push(`${name}=${this.closeQuery[name]}`)
                }

                if (query.length) {
                    return `#${this.$route.path}?${query.join('&')}`
                } else {
                    return `#${this.$route.path}`
                }
            },

            closeQuery () {
                const query = Object.assign({}, this.$router.currentRoute.query)
                const dialogs = query.dialogs.split(',')

                // Remove dialog from query
                const index = dialogs.indexOf(this.id)
                dialogs.splice(index, 1)

                // Update or remove dialog query
                if (!dialogs.length) {
                    delete query.dialogs
                } else {
                    query.dialogs = dialogs.join(',')
                }

                return query
            },

            iconPath () {
                return require(`../assets/sprites/${this.id}.svg`)
            }
        },

        methods: {
            close () {
                const query = this.closeQuery
                this.$router.push({ query })

                // Bubbling `close` event
                this.$emit('close', this.id)
            },

            error (err) {
                // Bubbling `error` event
                this.$emit('error', err, this.id)
            },

            success () {
                // Bubbling `success` event
                this.$emit('success', this.id)
            }
        }
    }
</script>

<style lang="stylus">
    @import '../styles/base/_colors'

    @import 'cozy-ui'


    [role=dialog]
        @extend $dialog

        [role=separator]
            cursor pointer
            background-color rgba(78, 91, 105, 0.75)

        .wrapper
            min-height 100vh
            padding 3em 1em
            box-sizing border-box

        [role=contentinfo]
            overflow initial
            flex-direction column

            header
                border-radius 0.52083em 0.52083em 0 0
                margin -1px -1px 2px
                height 7.5em

                display flex
                align-items center
                text-align center


                svg
                    margin 0 auto
                    max-height 4em


                [role='close']
                    position absolute
                    color white
                    right 3em

                    svg
                        width 2em
                        height 2em

        form
            display flex
            flex-flow row wrap

            .field
                margin 0 0 2em

            fieldset
                border 0
                flex 1 0px

                &[role="column1"]
                    flex 1 0px

                &[role="column2"]
                    flex 2 0px

                &[role="footer"]
                    flex 1 100%
                    border-top solid 1px $grey-01-alpha
                    text-align center
                    margin 0 -3em -2.5em

                p
                label
                    margin 0 0 0.5em

                input
                select
                button
                strong
                    background $grey-01
                    border-radius 2px
                    padding 0.5em 1em
                    color $grey-08
                    margin 0 0 0.5em

                input
                select
                button
                    border solid 1px $grey-03
                    width 17.5em

                strong
                    display block
                    margin-top 0.5em

                    &:empty
                        display none

                h3
                p
                input
                select
                label
                strong
                    color $grey-08

                h3
                    margin 0 0 0.5em

                label
                    display block

                .small-button
                    background none
                    border none
                    padding 0
                    margin 0

                    text-decoration none
                    text-align left
                    font-size 0.9em
                    color $grey-04

                    height 2em
                    line-height 2em

                    &:hover
                        color $blue

                .button
                button
                    text-transform uppercase
                    margin 0.5em 0.5em 0.5em 0

                    &.submit
                        color white
                        background-color $blue

                    &.danger
                        color $red
                        background-color $red-alpha
                        border solid 1px $red-alpha

                    &[disabled="true"]
                    &[disabled="disabled"]
                        background-color $blue-alpha


</style>
