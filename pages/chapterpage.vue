<template>
    <v-container v-if="chapter">
        <v-card class="mx-auto" max-width="400">
            <v-img
                :src="`https://isebarn-vid.s3.eu-west-2.amazonaws.com/${chapter.id}/original`"
                aspect-ratio=1.777
            ></v-img>
            <v-file-input
                label="Upload image"
                prepend-icon="mdi-camera"
                @change="uploader({file: $event, id: chapter.id})"
            ></v-file-input>
            <v-card-title>
                <v-text-field
                    v-model="name"
                    label="Chapter Name"
                    @input="updateChapterTimeout"
                ></v-text-field>
            </v-card-title>
            <v-card-text>
                <v-textarea
                    v-model="content"
                    label="Chapter Content"
                    @input="updateChapterTimeout"
                ></v-textarea>
            </v-card-text>
            <h1>Choices</h1>
            <!-- v-list of choices. On the left there is the choice.txt and on the right there is a v-combobox where you select choice.chapter -->
            <v-list>
                <v-list-item v-for="choice in choices" :key="choice.id">
                    <v-list-item-content>
                        <v-text-field
                            v-model="choice.text"
                            label="Choice"
                            @input="updateChoiceTimeout({chapter, choice})"
                        ></v-text-field>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-combobox
                            v-if="story"
                            v-model="choice.chapter"
                            :items="story.chapters"
                            item-text="name"
                            item-value="id"
                            label="Chapter"
                            @change="updateChoice({chapter, choice})"
                        ></v-combobox>
                    </v-list-item-action>
                </v-list-item>
                <!-- add choice button as a v-list-item that only has a plus icon -->
                <v-list-item @click="addChoice(chapter)">
                    <v-list-item-action>
                        <v-btn icon>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </v-card>
    </v-container>
</template>

<script>

// import vuex and vuex-map-fields
import { mapFields, mapMultiRowFields } from 'vuex-map-fields';
import { mapActions } from 'vuex';

export default {
    computed: {
        // get the chapter from the store
        ...mapFields('data', ['chapter', 'chapter.name', 'chapter.content', 'story']),
        ...mapMultiRowFields('data', ['chapter.choices']),
    },

    // methods to get the chapter from the store
    methods: {
        ...mapActions('data', ['getChapter', 'getStory', 'uploader', 'updateChapter', 'addChoice', 'updateChoice']),
        
        // updateChapterTimeout updates the chapter 1 sec after user has stopped typing
        updateChapterTimeout() {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.updateChapter(this.chapter);
            }, 500);
        },

        // updateChoiceTimeout updates the choice 1 sec after user has stopped typing
        updateChoiceTimeout(choice) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.updateChoice(choice);
            }, 500);
        },


    },

    // when the page is mounted, get the chapter with the id from the query
    mounted() {
        this.getChapter(this.$route.query.id);
        this.getStory(this.$route.query.story);
    },
}

</script>