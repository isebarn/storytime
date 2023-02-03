<template>
    <v-container>
        <v-card>
            <v-card-title>
                <h3 class="headline mb-0">{{ story.name }}</h3>
                <v-btn
                    color="primary"
                    class="white--text"
                    @click="readStory"
                    >
                    ReadStory
                </v-btn>
            </v-card-title>
            <div class="d-flex flex-no-wrap justify-space-between">
                <v-text-field
                    v-model="name"
                    label="Edit Title"
                    placeholder=""/>
            </div>
        </v-card>
        <v-data-table
            :headers="headers"
            :items="story.chapters"
            :items-per-page="5"
            class="elevation-1"
            @click:row="editChapter">
            <template v-slot:body.append>
                <td colspan="100%">
                    <v-btn
                    color="primary"
                    class="white--text"
                    @click="postChapter"
                    >
                    Add Chapter
                    </v-btn>
                </td>
            </template>      
            <template v-slot:item.actions="{ item }">
                <v-icon small @click="deleteChapter(item)">
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
    name: 'StoryPage',
    computed: {
        ...mapFields("stories", ['story', 'story.name']),
    },

    methods: {
        ...mapActions("stories", ['postChapter', 'setChapter', 'deleteChapter']),

        editChapter (item) {
            this.setChapter(item)
            this.$router.push({ name: 'chapter', params: { id: item.id } })
        },

        readStory (item) {
            this.setChapter(this.story.chapters[0])
            this.$router.push({ name: 'read'})
        }        
    },
    data () {
        return {
            headers: [
                {
                    text: 'Title',
                    align: 'start',
                    sortable: false,
                    value: 'name'
                },
                { text: 'Actions', value: 'actions', sortable: false },
            ]
        }
    },
}
</script>