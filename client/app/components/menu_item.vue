<template lang="pug">
    li: router-link(:to="{ name: 'categoryList', params: { id: item.id } }") {{ item.label }}
</template>

<script>
    export default {
        props: ['item']
    }
</script>
