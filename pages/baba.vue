<template>
    <v-container>
        <v-card v-for="story in stories" :key="story.id">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title
                    class="text-h5"
                    v-text="story.name"
                  ></v-card-title>
                </div>
  
                <v-avatar
                  class="ma-3"
                  size="125"
                  tile
                >
                  <v-img v-if="story.image" v-bind:src="story.image"></v-img>
                </v-avatar>
                <div>
                    <v-file-input  hide-input @change="uploader($event, story)"/>
                </div>
              </div>
        </v-card>
        
    </v-container>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapActions } from 'vuex'
export default {
    name: 'StoryPage',

    computed: {
        ...mapFields("stories", ['stories'])
    },
    methods: {
        ...mapActions("stories", ['getStories', 'updateStoryImage']),

        async uploader (file, story) {
            var formData = new FormData();
            formData.append("file", file);            
            await this.$axios.post(`aws_s3/images/image/${story.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            this.updateStoryImage(story)
        },

    },
    beforeMount () {
        this.getStories()
    }
}
</script>