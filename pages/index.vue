<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="stories"
      :items-per-page="5"
      class="elevation-1"
      @click:row="editStory">
      <template v-slot:body.append>
        <td colspan="100%">
          <v-btn
            color="primary"
            class="white--text"
            @click="postStory"
          >
            Add Story
          </v-btn>
        </td>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="deleteStory(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapActions } from 'vuex'
export default {
  name: 'IndexPage',

  data () {
    return {
      headers: [
        {
          text: 'Title',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        { text: 'Actions', value: 'actions', sortable: false}
      ]
    }
  },

  computed: {
    ...mapFields("stories", ['stories'])
  },

  methods: {
    ...mapActions("stories", ['getStories', 'postStory', 'setStory', 'setChapter', 'saveNewChapter', 'updateStory', 'deleteStory']),

    editStory (item) {
      this.setStory(item)
      this.$router.push({ name: 'story', params: { id: item.id } })
    },
  },

  beforeMount () {
    this.getStories()
  }
}
</script>
