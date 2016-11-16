<template lang="pug">
    div(aria-hidden="false" role="dialog")
        div(role="separator" @click="close")
        .wrapper
            a(:href="closeURL" @click="close") Close
            div(role="contentinfo")
                slot(name="header")
                    header(:style="headerInlineStyle")
                        p header sample

                main: slot

                footer: slot(name="footer")
                    button(@click="error") display error
                    button(@click="close") cancel
                    button(@click="success") next
</template>


<script>
    export default {
        props: ['id', 'headerStyles'],

        computed: {
            headerInlineStyle () {
                let styles = []
                for (let prop in  this.headerStyles) {
                    styles.push(`${prop}:${this.headerStyles[prop]}`)
                }
                return styles.join(';')
            },

            closeURL () {
                let query = []
                for (let name in this.closeQuery) {
                    query.push(`${name}=${this.closeQuery[name]}`)
                }

                if (query.length) {
                    return `${this.$route.path}?${query.join('&')}`
                } else {
                    return this.$route.path
                }
            },

            closeQuery () {
                const query = Object.assign({}, this.$router.currentRoute.query)
                const dialogs = query.dialogs.split(',')

                dialogs.splice(dialogs.indexOf(this.id), 1)

                if (!dialogs.length) {
                    delete query.dialogs
                } else {
                    query.dialogs = dialogs.join(',')
                }

                return query
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
