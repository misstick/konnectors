<template lang="pug">
    li: router-link(:to="{ name: 'categoryList', params: { id } }") {{ `category ${id}` | t }}
</template>

<script>
    export default {
        props: ['id']
    }
</script>
