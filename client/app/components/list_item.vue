<template lang="pug">

    li(v-on:click="openDialog")
        figure(:style="figureStyles")
            svg: use(:xlink:href="iconPath")

        h3 {{ item.name }}
        small {{ `category ${category}` | t }}

</template>

<script>
    export default {
      props: ['item', 'categories'],

      methods: {
          openDialog () {
              this.$parent.$emit('open-dialog', this.item)
          }
      },

      computed: {
          figureStyles () {
              const color = (this.item.color || {}).css || 'white'
              return `background: ${color}`
          },

          iconPath () {
              return require(`../assets/sprites/${this.item.slug}.svg`)
          },

          category () {
              return this.categories.find(item => item === this.item.category)
          }
      }
    }
</script>

<style lang="stylus">
    .list-item
        display: flex
        flex-flow: row wrap

        li
            width: 19em
            height: 13.5em

            box-sizing: border-box
            margin-right: 1.5em
            margin-bottom: 1.5em
            padding: 1em

            background-color: white
            box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15)

            cursor: pointer

          figure
              box-sizing: border-box
              height: 9em
              margin: -1em -1em 1em
              padding: 0

              display: flex
              align-items: center
              text-align: center

              svg
                  margin: 0 auto
                  width: 50%
                  max-height: 5em

            h3
                margin: 0

</style>
