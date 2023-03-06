<template>
    <v-container>
        <!-- make a list of cards that show stories by their names and the image -->
        <v-card v-for="story in stories" :key="story.id" class="mx-auto" max-width="400">
            <v-img
                :src="`https://isebarn-vid.s3.eu-west-2.amazonaws.com/${story.id}/original`"
                aspect-ratio=1.777
            ></v-img>
            <v-card-title class="headline">{{ story.name }}</v-card-title>
            <v-card-actions>
                <v-btn color="primary" text @click=" editStory(story)" >Edit</v-btn>
            </v-card-actions>
        </v-card>
        <!-- card with a centered button button to createStory -->
        <v-card class="mx-auto" max-width="400">
            <v-card-actions>
                <v-btn color="green" text @click=" createStory()" >Create New Story</v-btn>
            </v-card-actions>
        </v-card>
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