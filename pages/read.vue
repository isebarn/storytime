<template>
    <v-container>
        <v-card>
            <v-card-title>
                <h3 class="headline mb-0">{{ chapter.name }}</h3>
            </v-card-title>
            <v-card-text>
                <a v-html="chapter.content"></a>
            </v-card-text>
            <v-card-actions>
                <v-btn
                    v-for="choice in chapter.choices"
                    color="primary"
                    class="white--text"
                    @click="updateChapter(choice)"
                    >
                    {{ choice.text }}
                </v-btn>
            </v-card-actions>
            <v-avatar
                  class="ma-3"
                  size="125"
                  tile
                >
                  <v-img v-if="chapter.image" v-bind:src="chapter.image"></v-img>
                </v-avatar>            
        </v-card>
    </v-container>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapActions } from 'vuex'
export default {
    name: 'ReadStory',
    
    computed: {
        ...mapFields("stories", ["story", "chapter"])
    },

    created () {
        console.log(this.chapter)
    },

    methods: {
        ...mapActions("stories", ["setChapter"]),

        // find id of chapter from choice and set it
        updateChapter(choice) {
            let chapter = this.story.chapters.find(chapter => chapter.id === choice.chapter?.id)

            // if no chapter, go home
            if (!chapter) {
                this.goHome()
                return
            }

            this.setChapter(chapter)
        },

        goHome() {
            this.$router.push({ name: 'index' })
        }
    }
}
</script>