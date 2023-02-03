<template>
    <ClientOnly>
      <!-- Use the component in the right place of the template -->
      <tiptap-vuetify v-model="content" :extensions="extensions" @blur="updateChapter"/>
  
      <template #placeholder>
        Loading...
      </template>
    </ClientOnly>
  </template>
  
  <script>
  // import the component and the necessary extensions
  import {
    TiptapVuetify,
    Heading,
    Bold,
    Italic,
    Strike,
    Underline,
    Code,
    Paragraph,
    BulletList,
    OrderedList,
    ListItem,
    Link,
    Blockquote,
    HardBreak,
    HorizontalRule,
    History
  } from 'tiptap-vuetify'
  import { mapFields} from 'vuex-map-fields'
  import { mapActions } from 'vuex'
  export default {
    // specify TiptapVuetify component in "components"
    components: { TiptapVuetify },
    data: () => ({
      // declare extensions you want to use
      extensions: [
        History,
        Blockquote,
        Link,
        Underline,
        Strike,
        Italic,
        ListItem,
        BulletList,
        OrderedList,
        [
          Heading,
          {
            options: {
              levels: [1, 2, 3]
            }
          }
        ],
        Bold,
        Link,
        Code,
        HorizontalRule,
        Paragraph,
        HardBreak
      ],
      // starting editor's content
    }),

    computed: {
      ...mapFields("stories", ['chapter.content']),
    },

    methods: {
        ...mapActions("stories", ['patchChapter']),

        updateChapter () {
            this.patchChapter()
        },
    }
  }
  </script>
  