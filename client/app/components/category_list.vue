<template lang="pug">
    extends ../templates/layout.pug

    block content
        h1 {{ 'my_accounts category title' | t }}

        ul(class="list-item"): list-item(v-for="item in items",
          :item="item",
          :categories="categories")
</template>

<script>
    import ListItem from './list_item'

    export default {
      props: ['items', 'categories'],

      components: {
          'list-item': ListItem
      }
    }
</script>
