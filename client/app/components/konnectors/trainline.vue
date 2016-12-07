<template lang="pug">
    main
      form
        fieldset(role="column1")
            div(class='vendorLink')
            div(class='description') {{ item.description | t }}


        fieldset(role="column2")
          .field
              h3 Activité

              p Dernière synchronisation :
                  span en cours...

              button(class="inline-button") synchroniser maintenant


          .field
              h3 Emplacement

              p
                  label(for="location") Vous trouverez vos fichiers ...
                  select(name="location")

              button(class="inline-button") Ouvrir le dossier dans files


          .field
              h3 Fréquence de synchronisation

              p
                  label(for="syncFrequency")
                    | Vos fichiers seront ajoutés dans votre Cozy au rythme suivant :
                  select(name="syncFrequency")

              button(class="inline-button") Ouvrir le dossier dans files


          .field
              h3 Compte

              p
                  label(for="login") Identifiant
                  input(type="text", name="login", placeholder="michelle@mail.fr")

              p
                  label(for="password") Mot de passe
                  input(type="password", name="password")


          .field
              h3 Déconnexion

              p Vous serez déconnectés de ce compte, mais les données importées seront gardées.

              button(class='danger' id='delete-button')
                | {{ 'konnector delete credentials' | t }}


        fieldset(role='footer')
            button(id='reset-button') Annuler
            button(id='save-button', class="submit") Sauvegarder


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
        }
    }
</script>
