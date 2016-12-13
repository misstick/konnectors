<template lang="pug">
    main(:id="id")
      form(method="POST", onSubmit="return false")
        fieldset(role="column1")
            p(class='description')
              | {{ description | t }}

            ul
              li(v-for="account in $parent.item.accounts")
                strong {{ account.login }}

            button(class='small-button',
                    id='add-button',
                    v-on:click="save",
                    v-if="enableAccountCreation")
              | {{ 'add an account' | t }}


        fieldset(role="column2")
          .field
              h3 Activité

              p(v-if="lastImport") Dernière synchronisation:&nbsp;
                  span(id="lastImport") {{ lastImport }}

              button(class="small-button", v-if="!isImporting")
                  | synchroniser maintenant


          .field
              h3 Emplacement

              p(v-for="field in fields", v-if="field.type === 'folder'")
                  label(:for="field.name") Vous trouverez vos fichiers

                  select(:name="field.name", :id="field.name", :type="field.type",
                  v-on:change="onSelectChange",
                  :selected="account[field.name]")
                      option(v-for="path in paths", :value="path.id")
                        | {{ path.path }}

              a(:href="folderURI", class="button small-button")
                  | Ouvrir le dossier dans files

          .field
              h3
                  label(for="syncFrequency")
                      | Fréquence de synchronisation

              p
                  label(for="importInterval")
                    | Vos fichiers seront ajoutés dans votre Cozy au rythme suivant :
                  select(name="importInterval", id="importInterval", :value="this.importInterval")
                      option(v-for="interval, slug in intervals", :value="slug")
                          | {{ interval | t }}


          .field
              h3 Compte

              p(v-for="field in fields", v-if="field.type === 'text'")
                  label(:for="field.name") {{ field.label }}
                  input(type="text",
                          :name="field.name",
                          :id="field.name",
                          :value="account[field.name]",
                          placeholder="michelle@mail.fr")

              p(v-for="field in fields", v-if="field.type === 'password'")
                  label(:for="field.name") {{ field.label }}
                  input(type="password",
                          :name="field.name",
                          :id="field.name",
                          :value="account[field.name]")


          .field
              h3 Déconnexion

              p Vous serez déconnectés de ce compte, mais les données importées seront gardées.

              button(class='danger' id='delete-button')
                | {{ 'konnector delete credentials' | t }}


        fieldset(role='footer')
            button(id='reset-button', v-on:click="close") Annuler
            button(id='save-button', v-on:click="save", class="submit", :disabled="!enableAccountCreation") Sauvegarder

</template>


<script>
    const _ = require('lodash')

    // TODO: faire fonctionner le connecteur
    // TODO: masquer les champs (nouveaux fonctionnement)

    export default {
        data () {
            return {
                account: {},
                folderURI: null
            }
        },


        created () {
            this.selectDefaultFolder()
        },


        updated () {
            this.selectDefaultFolder()
        },


        computed: {

          id () {
              return `konnector-${this.$parent.item.slug}`
          },


          slug () {
              return this.$parent.item.slug
          },


          description () {
              return this.$parent.item.description
          },


          isImporting () {
              return this.$parent.item.isImporting
          },


          lastImport () {
              return this.$parent.item.lastImport
          },


          importInterval() {
              return this.$parent.item.importInterval
          },


          enableAccountCreation () {
              return this.$parent.item.accounts.length < 4
          },


          intervals () {
              return {
                  none: 'none',
                  hour: 'every hour',
                  day: 'every day',
                  week: 'every week',
                  month: 'each month'
              }
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
              var defaultFolder = this.defaultFolder
              let result = (window.initFolders || []).map(function(model) {
                  if (!isDefault)
                      isDefault = model.path === defaultFolder

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
            selectDefaultFolder () {
                if (!this.account["folder"]) {
                    const value = this.paths.find(path => path.path === this.defaultFolder)

                    // Update Folder
                    this.account["folder"] = value.path

                    // Update Folder URI
                    this.setFolderURI(value.path)
                }
            },

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

                const plop = this.fields.map(function(field) {
                  const el = document.getElementById(field.name)
                  let value
                  let err

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
                  if (!value || !value.length) {
                      value = null
                      err = ['empty', field.name]
                  }
                  if (result === undefined) result = []
                  result.push([field.name, value, err])
                })

                return result || null
            },

            save () {
                const emit = function() {
                    this.$parent.hub.$emit.apply(this.$parent, arguments)
                }

                const result = {}
                const errors = []
                const values = this.getFieldValues()
                values.forEach(function (data) {
                    if (!data[2])
                      result[data[0]] = data[1]
                    else
                      errors.push(data[2])
                })

                // Get other fields
                result['importInterval'] = document.getElementById('importInterval').value

                let el = document.getElementById('lastImport')
                result['lastImport'] = el ? el.textContent : new Date()

                // Update account if no errors
                // and display success notification
                if (!errors.length) {
                    // Add account to globals
                    this.$parent.item.accounts.push(result)

                    emit('success', this.slug, {
                        event: 'account.add.success',
                        account: result
                    })

                    // Reset form to add
                    // another account
                    this.account = {}
                }

                // otherwise emit event
                // to display errors notification
                else {
                    const result = {}
                    const prefix = 'account.add.error'
                    _.transform(errors, function(result, err) {
                        const type = `${prefix}.${err[0]}`
                        const value = err[1]

                        if (!result[type]) result[type] = []
                        if (-1 === result[type].indexOf(value)) result[type].push(value)
                    }, result)

                    emit('error', this.slug, result)
                }
            },

            close () {
                const path = this.$parent.closeURL
                this.$root.$router.push({ path })
            }
        }
    }
</script>
