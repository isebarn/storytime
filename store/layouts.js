import { getField, updateField } from 'vuex-map-fields'

// store to store the layout object
export const state = () => ({
    layouts: [],
})

// getters
export const getters = {
    getField,

    // get all layouts
    layouts: state => state.layouts,
}

// mutations to change the state
export const mutations = {
    updateField,
    layouts: (state, payload) => {
        state.layouts = payload
    }
}

// crud actions, GET, POST, PATCH, DELETE for /layout endpoints
export const actions = {
    async getLayouts({ commit }) {
        const layouts = await this.$axios.$get('/layout')
        commit('layouts', layouts)
    },

    async postLayout({ commit, state }, layout) {
        const { data } = await this.$axios.post('/layout', layout)
        commit('layouts', [...state.layouts, data])
    },

    async patchLayout({ commit, state }, layout) {
        const { data } = await this.$axios.patch(`/layout/${layout.id}`, layout)
        commit('layouts', state.layouts.map(x => x.id === data.id ? data : x))
    },

    async deleteLayout({ commit, state }, layout) {
        await this.$axios.delete(`/layout/${layout.id}`)
        commit('layouts', state.layouts.filter(x => x.id !== layout.id))
    }
}