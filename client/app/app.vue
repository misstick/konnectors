<template lang="pug">
    div(role="application")
        cozy-notif(v-for="item in notifications",
            :item="item")

        cozy-dialog(v-for="dialog in dialogs",
            :id="dialog.id",
            :headerStyles="dialog.headerStyles",
            :hub="dialog.hub",
            @close="onCloseDialog",
            @error="onErrorDialog",
            @success="onSuccessDialog")

            h3(slot="header") {{ dialog.title }}

            component(:is="dialog.component")

            ul(slot="footer")
                li: button(@click="dialog.hub.$emit('error', 'this is a notification error')") Error
                li: button(@click="dialog.hub.$emit('close')") Cancel
                li: button(@click="dialog.hub.$emit('success')") Next

        aside
            h4 {{ 'my_accounts title' | t }}
            ul(role="navigation")
                li
                    router-link(to="/discovery")
                        svg: use(:xlink:href="require('./assets/sprites/icon-discovery.svg')")
                        | {{ 'my_accounts discovery title' | t }}


                li
                    router-link(to="/category")
                        svg: use(:xlink:href="require('./assets/sprites/icon-category.svg')")
                        | {{ 'my_accounts category title' | t }}

                    ul: menu-item(v-for="item in categories", :item="item")


                li
                    router-link(to="/connected")
                        svg: use(:xlink:href="require('./assets/sprites/icon-connected.svg')")
                        | {{ 'my_accounts connected title' | t }}

        router-view(v-on:open-dialog='onOpenDialog',
            :items="items",
            :categories="categories")

</template>


<script>
    import DialogComponent from './components/dialog'
    import NotifComponent from './components/notification'
    import MenuItem from './components/menu_item'

    import Dialogs from './models/dialog_example'
    import Categories from './models/categories'


    export default {
      data () {
          return {
              dialogs: [],
              notifications: [],
              config: Dialogs,

              items: [],
              categories: [],
              category: null
          }
      },

      components: {
          'cozy-dialog': DialogComponent,
          'cozy-notif': NotifComponent,
          'menu-item': MenuItem
      },

      created () {
          const to = this.$root.$router.currentRoute
          this.updateMenu(to)
          this.updateDialogs(to)
      },

      watch: {
          '$route' (to, from) {
              this.updateMenu(to)
              this.updateDialogs(to)
          }
      },

      methods: {
          updateMenu (to, from) {
              if ('categoryList' === to.name) {
                  // Update Menu from Route
                  this.categories = Categories

                  // Update Content from Route
                  // get all Konnectors for 'all' categories
                  if ('all' !== to.params.id)
                    this.items = window.initKonnectors.filter(item => item.category === to.params.id)
                  else
                    this.items = window.initKonnectors

              } else {
                  this.categories = []
                  this.items = []
              }
          },

          updateDialogs (to, from) {
              const dialogs = to.query.dialogs

              if (typeof dialogs === 'string')
                  // Check if query have a configuration
                  // if none do not it save into dialogs
                  this.dialogs = dialogs.split(',').map((id) => {
                      return this.config.find(item => item.id === id)
                  }).filter(item => !!item)
              else
                  this.dialogs = []
          },

          onOpenDialog (data={}) {
              const id = data.slug

              // Override queryDialogs
              let query = this.$root.$router.currentRoute.query
              delete query.dialogs

              let dialogs = query.dialogs || null
              query = Object.assign({}, query)

              if (dialogs) {
                  dialogs = dialogs.split(',')
                  if (-1 === dialogs.indexOf(id))
                      query.dialogs = dialogs.concat([id]).join(',')
              } else {
                  query.dialogs = id
              }

              this.$root.$router.push({ query })
          },

          onCloseDialog (id) {
              // Close Notifications
              // related to this item
              this.onCloseNotif(id)
          },

          onSuccessDialog (id) {
              // Close Dialog
              this.onCloseDialog(id)

              // Goto NextComponent
              const dialog = this.config.find(item => item.id === id)
              if (dialog && dialog.routes.success) {
                  this.$root.$router.push(dialog.routes.success)
              }
          },

          onErrorDialog (err, id) {
              this.onOpenNotif(err, id)
          },

          onOpenNotif (msg, id) {
              this.notifications.push({
                  type: 'error',
                  label: msg,
                  dialog: id
              })
          },

          onCloseNotif (id) {
              this.notifications = this.notifications.filter((notif) => {
                  return notif.dialog !== id
              })
          }
      },
    }
</script>


<style lang="stylus">
    @import '../node_modules/normalize.css/normalize.css'
    @import './styles/base/_normalize'
    @import './styles/base/_colors'

    @import 'cozy-ui'

    [role=application]
        @extend $app-2panes-toolbar
        background-color: $grey-01-alpha

        main
            padding: 2.5em 3em

        h1
            font-size: 2em
            margin: 0 0 1em


    aside
        width: 13.75em
        background-color: $grey-01
        box-shadow: inset -1px 0 0 0 $grey-01-alpha

        h4
            font-weight: normal
            font-size: 1.5em
            padding: 1em 1.5em
            margin: 0


    [role="navigation"]
        li
            display: flex
            flex-direction: column

        a
            text-decoration: none
            flex: 1

            &:hover:not(.router-link-active)
                background-color: $grey-01-alpha


        >li>a
            padding: 1em 1.5em
            margin: 0.25em 0
            color: $red


            svg
                width: 1.5em
                height: 1.5em
                margin-right: 0.5em
                display: inline-block
                vertical-align: middle
                fill: #F92B3F

            &.router-link-active
                background-color: $red
                color: white

                svg
                    fill: white

        ul
            padding: 0.5em 0 0.5em 3em

            &:empty
                display: none

            li>a
                color: $grey-08
                line-height: 2
                border-radius: 0.25em 0 0 0.25em
                padding-left: 0.5em

                &.router-link-active
                    background-color: $grey-08
                    color: white



</style>
