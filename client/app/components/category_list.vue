<template lang="pug">
    extends ../templates/layout.pug

    block content
        h1 {{ 'my_accounts category title' | t }}

        ul(class="list-item"): list-item(v-for="item in items",
          :item="item",
          :category="category")
</template>

<script>
    import ListItem from './list_item'

    export default {
      props: ['items', 'category'],

      components: {
          'list-item': ListItem
      }
    }
</script>
