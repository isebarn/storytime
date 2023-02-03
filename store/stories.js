import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  stories: [],
  story: null,
  chapter: null,
  choice: null
})

export const mutations = {
  updateField,

  stories: (state, payload) => {
    state.stories = payload
  },

  resetNewStory: (state) => {
    state.newStory = {
      name: '',
    }
  },

  story: (state, payload) => {
    state.story = payload
  },

  addChapter: (state, payload) => {
    state.story.chapters.push(payload)
  },

  addStory: (state, payload) => {
    state.stories.push(payload)
  },

  chapter: (state, payload) => {
    state.chapter = payload
  },

  // remove chapter from story by its id
  deleteChapterById: (state, id) => {
    let chapters = state.story.chapters.filter(chapter => chapter.id !== id)
    state.story.chapters = chapters
  },

  // remove story from story list by its idNew Choice
  deleteStoryById: (state, id) => {
    let stories = state.stories.filter(story => story.id !== id)
    state.stories = stories
  },

  // add choice to chapter
  addChoice: (state, payload) => {
    state.chapter.choices.push(payload)
  },

  // set choice
  choice: (state, payload) => {
    state.choice = payload
  }
  
}

export const getters = {
  getField,

  stories (state) {
    return state.stories
  },

  story (state) {
    return state.story
  },

  chapter (state) {
    return state.chapter
  }
}

export const actions = {

  setStory ({ commit }, story) {
    commit('story', story)
  },  

  async getStories ({ commit }) {
    const {data} = await this.$axios.get("story?$include=chapters,chapters__choices")
    commit('stories', data)
  }, 

  async postStory ({ commit, state }) {
    const {data} = await this.$axios.post("story", {
      name: `Story ${state.stories.length + 1}`,
    })
    commit('addStory', data)
  },  

  async patchStory ({ state, dispatch }) {
    await this.$axios.patch("story", state.story)
  },  

  async deleteStory ({ commit, dispatch }, story) {
    commit('deleteStoryById', story.id)
    await this.$axios.delete(`story/${story.id}`)
  },  

  setChapter ({ commit }, chapter) {   
    commit('chapter', chapter)
  },   

  async postChapter ({ commit, state, dispatch }) {
    const {data} = await this.$axios.post("chapter", {
      name: `Chapter ${state.story.chapters.length + 1}`,
      choices: []
    })
    commit('addChapter', data)
    await this.$axios.patch("story", state.story)
  },  

  async patchChapter ({ state, dispatch }) {
    await this.$axios.patch("chapter", state.chapter)
  },

  async deleteChapter ({ commit, dispatch }, chapter) {   
    // remove chapter from story by its id
    commit('deleteChapterById', chapter.id)
    dispatch('patchStory')
    await this.$axios.delete(`chapter/${chapter.id}`)
  },


  async postChoice ({ commit, state, dispatch }) {
    const {data} = await this.$axios.post("choice", {
      text: "New Choice"
    })

    commit('addChoice', data)
    await this.$axios.patch("chapter", state.chapter)
  },

  async patchChoice ({commit, state, dispatch}, id) {
    let choice = state.chapter.choices.find(choice => choice.id === id)    
    await this.$axios.patch("choice", choice)
  },

  setChoice ({ commit }, choice) {
    commit('choice', choice)
  },

  resetChapter ({ commit }) {
    commit('chapter', null)
  }
}
