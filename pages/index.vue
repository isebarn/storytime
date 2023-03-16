<template>
    <v-container fluid>
        <!-- make a list of cards that show stories by their names and the image -->
        <v-row dense>
          <v-col cols="12">
            <v-card-actions>
                <v-btn color="green" text @click=" createStory()" >Create New Story</v-btn>
            </v-card-actions>
          </v-col>
          <v-col v-for="story in stories" :key="story.id" cols="4">

        <v-card >
            <v-img
                :src="`https://isebarn-vid.s3.eu-west-2.amazonaws.com/${story.id}/original`"
                aspect-ratio=1.777
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
                cover
                class="align-end"
            ><v-card-title class="headline" style="color: white" v-text="story.name"/></v-img>

            <v-card-actions>
                <v-btn color="primary" icon @click=" editStory(story)" ><v-icon>mdi-pencil</v-icon></v-btn>
            </v-card-actions>
        </v-card>
        <!-- card with a centered button button to createStory -->
        <v-card class="mx-auto" max-width="400">
        </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
// import vuex and vuex-map-fields
import { mapFields } from 'vuex-map-fields';
import { mapGetter, mapActions } from 'vuex';

export default {
    computed: {
        ...mapFields('data', ['stories']),
    },

    // methods to get the stories from the database
    methods: {
        ...mapActions('data', ['getStories', 'createStory']),

        // edit story pushes test/story and passes the story id to path
        editStory(story) {
            this.$router.push({ path: `/storypage`, query: { id: story.id } });
        },
    },

    // when the page is mounted, get the stories
    created() {
        this.getStories();
    },
}
</script>
