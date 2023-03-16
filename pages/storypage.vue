<template>
    <v-container v-if="story" fluid>
      <v-card style="padding: 12px">
      <v-row dense>
        <v-col cols="4">
          <v-card flat>
            <v-img
                :src="`https://isebarn-vid.s3.eu-west-2.amazonaws.com/${story.id}/original`"
                aspect-ratio=1.777
            ></v-img>
            <!-- v-file-input to upload an image and call uploader -->
            <v-file-input
                label="Upload image"
                prepend-icon="mdi-camera"
                @change="uploader({file: $event, id: story.id})"
            ></v-file-input>
            <!-- story.name as the v-card-title but it is editable -->
            <v-text-field
                v-model="name"
                label="Story name"
                outlined
                dense
                @input="updateStoryNameTimeout"
            ></v-text-field>
          </v-card>
        </v-col>
        <v-col cols="8">
          <v-card flat>
            <v-card-text v-if="story?.chapters">
                <h1>Pages</h1>
                <!-- iterate story.chapters. show on the left the image, then name, and on the right have edit/delete icons -->
                <v-list-item v-for="chapter in story.chapters" :key="chapter.id">
                    <v-list-item-avatar>
                        <v-img
                            :src="`https://isebarn-vid.s3.eu-west-2.amazonaws.com/${chapter.id}/original`"
                            aspect-ratio="2.75"
                        ></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ chapter.name }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn icon @click="editChapter(chapter)">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="dialog = true">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                        <v-dialog
                          v-model="dialog"
                          width="auto"
                        >
                          <!-- card with a confirmation for deletion -->
                          <v-card>
                            <v-card-title class="headline">Are you sure you want to delete this chapter?</v-card-title>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                color="blue darken-1"
                                text
                                @click="dialog = false"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                color="blue darken-1"
                                text
                                @click="deleteChapter({story, chapter});dialog = false"
                              >
                                Delete
                              </v-btn>
                              <v-spacer></v-spacer>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                    </v-list-item-action>
                </v-list-item>
                <!-- add chapter button as a v-list-item that only has a plus icon -->
                <v-list-item @click="addChapter(story)">
                    <v-list-item-action>
                        <v-btn icon>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-card-text>
        </v-card>
        </v-col>
      </v-row>
    </v-card>

    </v-container>
</template>

<script>

// import vuex and vuex-map-fields
import { mapFields } from 'vuex-map-fields';
import { mapActions } from 'vuex';

export default {
    name: "storypage",

    data () {
      return {
        dialog: false
      }
    },

    computed: {
        // get the story from the database
        ...mapFields('data', ['story', 'story.name']),
    },

    // methods to get the story from the database
    methods: {
        ...mapActions('data', ['getStory', 'uploader', 'updateStoryName', 'deleteChapter', 'addChapter']),

        // updateStoryNameTimeout updates the story 1 sec after user has stopped typing
        updateStoryNameTimeout() {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.updateStoryName(this.story);
            }, 500);
        },

        // edit chapter pushes test/chapter and passes the chapter id as a query parameter
        editChapter(chapter) {
            console.log(1)
            this.$router.push({ path: `/chapterpage`, query: { id: chapter.id, story: this.story.id } });
        },

    },

    // when the page is mounted, get the story with the id from the query
    mounted() {
        this.getStory(this.$route.query.id);
    },



}

</script>
