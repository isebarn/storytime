export default function ({ store, route, redirect, dispatch }) {
    if (route.name === 'story' && !store.state.stories?.story) {
      dispatch("stories/resetChapter")
      return redirect('/')
    }

    if (route.name === 'chapter' && !store.state.stories?.chapter) {
      return redirect('/story')
    }


  }