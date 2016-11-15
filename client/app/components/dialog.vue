<template lang="pug">
    div(aria-hidden="false" role="dialog")
        div(role="separator" @click="close")
        .wrapper
            div(role='contentinfo')
                header(:style="headerStyles")
                    a(@click="close" title='close') Close
                    p header sample

                main
                    p dialog free content

                footer
                  button(@click="error" title='display error') display error
                  button(@click="close" title='cancel') cancel
                  button(@click="success" title='OK') next
</template>


<script>
    import Vue from 'vue'

    export default {
        props: ['id', 'header', 'content'],

        computed: {
            headerStyles () {
                return `background-image: url('${this.header}');`
            }
        },

        methods: {
            close () {
                const query = Object.assign({}, this.$router.currentRoute.query)
                const dialogs = query.dialogs.split(',')

                dialogs.splice(dialogs.indexOf(this.id), 1)

                if (!dialogs.length) {
                    delete query.dialogs
                } else {
                    query.dialogs = dialogs.join(',')
                }

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
                this.close()
            }
        }
    }
</script>


<style lang="stylus">
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
</style>
