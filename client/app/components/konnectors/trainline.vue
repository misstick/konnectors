<template lang="pug">
    main(:id="id")
      form(method="POST", onSubmit="return false")
        fieldset(role="column1")
            p(class='description')
              | {{ description | t }}

            strong(v-if="account")
              | {{ account.login }}

            button(class='small-button',
                    id='add-button',
                    v-on:click="save")
              | {{ 'add an account' | t }}


        fieldset(role="column2")
          .field
              h3 Activité
              p Dernière synchronisation : span: en cours...
              button(class="small-button") synchroniser maintenant


          .field
              h3 Emplacement

              p(v-for="field in fields", v-if="field.type === 'folder'")
                  label(:for="field.name") Vous trouverez vos fichiers

                  select(:name="field.name", :id="field.name", :type="field.type",
                  v-on:change="onSelectChange")
                      option(v-for="path in paths", :value="path.id")
                        | {{ path.path }}

              a(:href="folderURI", class="button small-button")
                | Ouvrir le dossier dans files

          .field
              h3: label(for="syncFrequency") Fréquence de synchronisation

              p
                  label(for="syncFrequency")
                    | Vos fichiers seront ajoutés dans votre Cozy au rythme suivant :
                  select(name="syncFrequency", id="syncFrequency")


          .field
              h3 Compte

              p(v-for="field in fields", v-if="field.type === 'email'")
                  label(:for="field.name") {{ field.label }}
                  input(type="text", :name="field.name", :id="field.name",
                          placeholder="michelle@mail.fr")

              p(v-for="field in fields", v-if="field.type === 'password'")
                  label(:for="field.name") {{ field.label }}
                  input(type="password", :name="field.name", :id="field.name")


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

    // TODO: faire fonctionner le connecteur
    // TODO: masquer les champs (nouveaux fonctionnement)
    // TODO: bouger l'erreur dans la notification

    export default {
        data () {
            return {
                account: {},
                folderURI: null
            }
        },

        created () {
            // Select default directory
            if (!this.account["folder"]) {
                const value = this.paths.find(path => path.path === this.defaultFolder)

                // Update Folder
                this.account["folder"] = value.path

                // Update Folder URI
                this.setFolderURI(value.path)
            }
        },
        computed: {
          id () {
              return `konnector-${this.$parent.item.slug}`
          },

          description () {
              return this.$parent.item.description
          },

          fields () {
              const result = []
              const fields = this.$parent.item.fields

              for (let field in fields) {
                  result.push({
                      name: field,
                      label: field,
                      type: fields[field],
                      value: this.account[field] || null
                  })
              }

              return result
          },

          defaultFolder () {
              return `/Administration/${this.$parent.item.slug}`
          },

          paths () {
              let isDefault = false
              let result = (window.initFolders || []).map((model) => {
                  if (!isDefault)
                      isDefault = model.path === this.defaultFolder

                  return Object.assign(model, {
                      path: `${model.path}/${model.name}`,
                      url: `folders/${model.id}`
                  })
              })

              // Add default folder if
              // its missing to the list
              if (!isDefault)
                  result.unshift({
                      id: this.defaultFolder,
                      path: this.defaultFolder,
                      url: `/#apps/files/folders${this.defaultFolder}`
                  })

              return result
          }
        },


        methods: {
            onSelectChange ({ currentTarget }) {
                const value = currentTarget.value
                const type = currentTarget.getAttribute('type')

                // Update Folder value
                this.account[type] = value

                // Update Folder URI
                this.setFolderURI(value)
            },


            // For folder fields requires to convert
            // the value (a folder id)-input to a folder path.
            setFolderURI (value) {
                const path = this.paths.find(path => path.id === value) || {}
                this.folderURI = path.url || "/#apps/files/"
            },


            getFieldValues () {
                let result

                const plop = this.fields.map((field) => {
                  const el = document.getElementById(field.name)
                  let value

                  switch (field.type) {
                      case 'label':
                          value = el.textContent
                          break

                      case 'link':
                          value = el.getAttribute('href')
                          break

                      case 'folder':
                          value = this.account['folder']
                          break

                      default:
                          value = el.value
                          break
                  }

                  if (value && !value.length) value = null
                  if (result === undefined) result = []
                  result.push([field.name, value])
                })

                return result || null
            },

            save () {
                // Save Account
                // and update VueData
                const values = this.getFieldValues()

                // TODO : handle ErrorNotif when no login/password found
                // TODO: handle SuccessNotif when save succeed
                if (values) {
                  const result = {}
                  values.forEach(data => result[data[0]] = data[1])
                  this.account = result
                }
            }
        }
    }
</script>
