// core.js
// This file manages the core.html frontend contents. It uses Vue.js to create a simple single-page application (SPA) with three main components: Data Source, Query Builder, and Results.

const { createApp, ref, onMounted, defineAsyncComponent } = Vue

const DataSource = defineAsyncComponent(() =>
  import('./data_source.js')
)

const app = createApp({
  data() {
    return {
      currentRoute: 'home',
      orgName: 'User: N/A' 
    };
  },
  mounted() {
    // When the page loads, get the organization name from local storage
    const orgName = sessionStorage.getItem('orgName');
    if (orgName) {
      this.orgName = orgName;
    }
  },
  setup() {
    const currentRoute = ref('data-source')
    
    const navigate = (route) => {
      if (route === 'home') {
        window.location.href = 'index.html'
      } else {
        currentRoute.value = route
        window.location.hash = route
      }
    }

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (['data-source', 'query-builder', 'results'].includes(hash)) {
        currentRoute.value = hash
      }
    }

    onMounted(() => {
      handleHashChange() // Set initial route based on hash
      window.addEventListener('hashchange', handleHashChange)
    })

    return {
      currentRoute,
      navigate
    }
  },
  components: {
    DataSource
  },
  template: `
    <div class="container">
      <aside class="sidebar">
        <ul>
          <li class="profile">{{ orgName }}</li>
          <li @click="navigate('home')" class="home">Home</li>
          <li @click="navigate('data-source')" :class="['data-source', { active: currentRoute === 'data-source' }]">Data Source</li>
          <li @click="navigate('query-builder')" :class="['query-builder', { active: currentRoute === 'query-builder' }]">Query Builder</li>
          <li @click="navigate('results')" :class="['results', { active: currentRoute === 'results' }]">Results</li>
        </ul>
      </aside>
      <main class="main-content">
        <DataSource v-if="currentRoute === 'data-source'" />
        <h2 v-else-if="currentRoute === 'query-builder'">Query Builder</h2>
        <h2 v-else-if="currentRoute === 'results'">Results</h2>
      </main>
    </div>
  `
})

app.mount('#app')