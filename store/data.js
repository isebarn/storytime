// import vuex-map-fields
import { getField, updateField } from 'vuex-map-fields';

/* table layout {
    name varchar
    structure dict
}

table choice {
    text varchar
    chapter varchar
}

table chapter {
    name varchar
    image_url varchar
    choices [ref: < choice.id]
    struct dict
    content varchar
}

table story {
    name varchar
    image_url varchar
    chapters [ref: < chapter.id]
} */

// state for the tables above, both single objects and lists of objects
export const state = () => ({
    stories: [],
    chapters: [],
    choices: [],
    story: null,
    chapter: null,
    choice: null
});




// getters for the tables above, both single objects and lists of objects
export const getters = {
    getField,

};

// mutations for the tables above, both single objects and lists of objects
export const mutations = {
    updateField,

    // mutation to set stories
    setStories(state, stories) {
        state.stories = stories;
    },

    // mutation to set a single story
    setStory(state, story) {
        state.story = story;
    },

    // mutation to set a single chapter
    setChapter(state, chapter) {
        state.chapter = chapter;
    },

}

// actions for the tables above, both single objects and lists of objects
// the api endpionts are /story, /chapter, /choice
export const actions = {

    async uploader ({ commit }, {file, id}) {
        var formData = new FormData();
        formData.append("file", file);  
        await this.$axios.post(`aws_s3/images/image/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },   
    
    // action to create a new story and then call the getStories action to update the stories state
    async createStory({ dispatch }) {
        await this.$axios.$post('/story', { name: 'Story ' + (this.state.data.stories.length + 1)});
        dispatch('getStories');
    },

    // action to get stories
    async getStories({ commit }) {
        const stories = await this.$axios.$get('/story?$include=chapters,chapters__choices');
        commit('setStories', stories);
    },

    // action to get a single story by passing the id as a query parameter, and include chapters
    async getStory({ commit }, id) {
        const story = await this.$axios.$get(`/story?id=${id}&$include=chapters,chapters__choices`);
        commit('setStory', story[0]);
    },

    // updateStoryName: action to update the name of a story using patch
    async updateStoryName({ commit }, story) {
        await this.$axios.$patch(`/story/${story.id}`, { name: story.name });
    },

    // deleteChapter deletes the chapter and removes it from the story object and re-sets the story state
    async deleteChapter({ dispatch }, {story, chapter}) {
        await this.$axios.$delete(`/chapter/${chapter.id}`);
        await this.$axios.$patch(`/story/${story.id}`, { chapters: story.chapters.filter(c => c.id != chapter.id) });
        dispatch('getStory', story.id);
    },

    // addChapters adds a chapter to the story object and re-sets the story state
    // we first POST a new chapter with name: 'chapter ' + story.chapters.length
    // then we patch the story with the id's of the current chapters and the new chapter
    async addChapter({ dispatch }, story) {
        const newChapter = await this.$axios.$post('/chapter', { name: 'chapter ' + (story.chapters.length + 1) });
        await this.$axios.$patch(`/story/${story.id}`, { chapters: [...story.chapters.map((c) => c.id), newChapter.id] });
        dispatch('getStory', story.id);
    },

    // action to get a single chapter by passing the id as a query parameter, and include choices
    async getChapter({ commit }, id) {
        const chapter = await this.$axios.$get(`/chapter?id=${id}&$include=choices,choices__chapter`);
        commit('setChapter', chapter[0]);
    },

    // updateChapterName: action to update the name of a chapter using patch
    async updateChapter({ commit }, chapter) {
        await this.$axios.$patch(`/chapter/${chapter.id}`, { name: chapter.name, content: chapter.content });
    },

    // addChoice POSTs a new choice to the chapter object and re-sets the chapter state
    async addChoice({ dispatch }, chapter) {
        const newChoice = await this.$axios.$post('/choice', { text: 'choice ' + (chapter.choices.length + 1) });
        await this.$axios.$patch(`/chapter/${chapter.id}`, { choices: [...chapter.choices.map((c) => c.id), newChoice.id] });
        dispatch('getChapter', chapter.id);
    },

    // updateChoice updates the text of a choice using patch and the choice.chapter and updates the chapter state
    async updateChoice({ dispatch }, {chapter, choice}) {
        await this.$axios.$patch(`/choice/${choice.id}`, { text: choice.text, chapter: choice.chapter.id });
        dispatch('getChapter', chapter.id);
    }
};
