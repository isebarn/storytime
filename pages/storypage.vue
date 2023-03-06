<template>
    <v-container v-if="story">
        <!-- card that shows the title (name) of the story and a list of chapters (name and image) in v-list-item -->
        <v-card>
            <v-img
                :src="`https://isebarn-vid.s3.eu-west-2.amazonaws.com/${story.id}/original`"
                aspect-ratio="2.75"
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
            <v-card-text v-if="story?.chapters">
                <h1>Chapters</h1>
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
                        <v-btn icon @click="deleteChapter({story, chapter})">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
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
    </v-container>
</template>

<script>

// import vuex and vuex-map-fields
import { mapFields } from 'vuex-map-fields';
import { mapActions } from 'vuex';

export default {
    name: "storypage",
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
            this.$router.push({ path: `/chapterpage`, query: { id: chapter.id, story: this.story.id } });
        },

    },

    // when the page is mounted, get the story with the id from the query
    mounted() {
        this.getStory(this.$route.query.id);
    },



}

</script>