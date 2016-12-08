<template lang="pug">
    main
        article(role='description')
            div(class='vendorLink')

            div(class='description') {{ item.description | t }}


        form(role='import')
            div(class='fields')

            div(class='add-buttons')
                button(class='small', id='add-button') {{ 'add an account' | t }}
                button(class='small', id='remove-button') {{ 'remove last account' | t }}

            div(class='buttons config')
                button(id='import-button') {{ 'save and import' | t }}

            div(class='error', v-if="this.item.importErrorMessage && !this.item.isImporting")
                span(class='error') {{ 'error occurred during import:' | t}}
                    span(class='message') {{ item.importErrorMessage | t }}

            div(class='status') {{ status }}

            div(class='infos')
                div(class='date')
                    span(class='label') {{ 'last import:' | t }}
                    span(class='last-import')

                div(class='datas')
                    | {{ 'imported data:' | t }}&nbsp;

                    a(:href="importedURI", target="_blank", v-for="name in item.modelNames") {{ name }}&nbsp;

            div(class='danger-zone')
                h3 {{ 'konnector danger zone' | t }}
                button(class='danger' id='delete-button')
                  | {{ 'konnector delete credentials' | t }}

</template>


<script>

    // TODO: ajouter les CSS
    // TODO: faire fonctionner le connecteur
    // TODO: masquer les champs (nouveaux fonctionnement)
    // TODO: bouger l'erreur dans la notification

    export default {
        computed: {
          name () {
              return this.$parent.item.id
          },

          item () {
              return this.$parent.item
          },

          importedURI () {
              return `/apps/databrowser/#search/all/${this.name}`
          },

          status () {
              return "STATUS: ?!"
          }
        }
    }
</script>
