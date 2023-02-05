<template>
    <v-container>
        <v-card>
            <v-card-title>
                <h3 class="headline mb-0">{{ name }}</h3>
            </v-card-title>
            <div class="d-flex flex-no-wrap justify-space-between">
                <v-text-field
                    v-model="name"
                    label="Edit Chapter Title"
                    placeholder=""
                    @blur="patchChapter"/>
            </div>
            <v-avatar
                  class="ma-3"
                  size="125"
                  tile
                >
                  <v-img v-if="chapter.image" v-bind:src="chapter.image"></v-img>
                </v-avatar>
                <div>
                    <v-file-input  hide-input @change="uploader($event, chapter)"/>
                </div>             
        </v-card> 
        <Editor/>
        <v-data-table
            :headers="headers"
            :items="choices"
            :items-per-page="5"
            class="elevation-1">
        <template v-slot:body.append>
            <td colspan="100%">
                <v-btn
                color="primary"
                class="white--text"
                @click="postChoice"
                >
                Add Choice
                </v-btn>
            </td>
        </template>
        <template v-slot:item.text="{ item }">
            <v-text-field v-model="item.text" @blur="patchChoice(item.id)"/>
        </template>
        <template v-slot:item.chapter="{ item }">
            <v-autocomplete
                v-model="item.chapter"
                :items="chapters"
                item-text="name"
                item-value="id"
                @blur="patchChoice(item.id)"
                />
        </template>        
        </v-data-table>      
    </v-container>
</template>

<script>
import { mapFields, mapMultiRowFields } from 'vuex-map-fields'
import { mapActions } from 'vuex'
import Editor from '../components/Editor'
export default {
    name: 'ChapterPage',

    components: {
        Editor
    }, 

    data () {
        return {
            headers: [
                {
                    text: 'Title',
                    align: 'start',
                    sortable: false,
                    value: 'text'
                },
                { text: 'chapter', value: 'chapter', sortable: false },
            ],            
        }
    },

    computed: {
        ...mapFields("stories", ['story.chapters', 'chapter', 'chapter.name', 'chapter.content', 'choice.text']),
        ...mapMultiRowFields("stories", ['chapter.choices']),
    },

    methods: {
        ...mapActions("stories", ['patchChapter', 'postChoice', 'patchChoice', 'setChoice', 'updateChapterImage']),

        async uploader (file, chapter) {
            var formData = new FormData();
            formData.append("file", file);            
            await this.$axios.post(`aws_s3/images/image/${chapter.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            this.updateChapterImage(chapter)
        },
    },
}
</script>