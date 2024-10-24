// frontend/js/index.js
// This file manages the home page frontend logic
const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      currentRoute: 'home',
      orgName: 'User: N/A',
      influxUrl: null,
      influxToken: null,
    };
  },
  mounted() {
    // Read the organization name, InfluxDB URL, and token from sessionStorage when the page loads
    const orgName = sessionStorage.getItem('orgName');
    const influxUrl = sessionStorage.getItem('influxUrl');
    const influxToken = sessionStorage.getItem('influxToken');
    
    if (orgName) this.orgName = orgName;
    if (influxUrl) this.influxUrl = influxUrl;
    if (influxToken) this.influxToken = influxToken;
  },
  methods: {
    navigate(route) {
      if (route === 'home') {
        this.currentRoute = 'home';
      } else {
        window.location.href = `core.html#${route}`;
      }
    },
    goToLogin() {
      window.location.href = 'login.html';
    },
    goToRegister() {
      window.location.href = 'register.html';
    },
    async defaultConfigLogin() {
      try {
          const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({})
          });
  
          const data = await response.json();
  
          if (response.status === 200) {
              alert('Login successful!');
  
              // Store the default organization name, InfluxDB URL, and token in sessionStorage
              sessionStorage.setItem('orgName', data.org);
              sessionStorage.setItem('influxUrl', data.url);
              sessionStorage.setItem('influxToken', data.token);
  
              // Update the organization name, InfluxDB URL, and token in the Vue app
              this.orgName = data.org;
              this.influxUrl = data.url;
              this.influxToken = data.token;
          } else {
              alert(`Login failed: ${data.message}`);
          }
      } catch (error) {
          alert('Error during login request');
          console.error('Login error:', error);
      }
  },
    logout() {
      sessionStorage.clear();
      this.orgName = 'User: N/A';
      this.influxUrl = null;
      this.influxToken = null;
    }
  },
  template: `
    <div class="container">
      <aside class="sidebar">
        <ul>
          <li class="profile">{{ orgName }}</li>
          <li @click="navigate('home')" :class="['home', { active: currentRoute === 'home' }]">Home</li>
          <li @click="navigate('data-source')" class="data-source">Data Source</li>
          <li @click="navigate('query-builder')" class="query-builder">Query Builder</li>
          <li @click="navigate('results')" class="results">Results</li>
        </ul>
      </aside>
      <main v-if="influxUrl && influxToken" class="profile-page">
        <div>
          <h2>InfluxDB Profile</h2>
          <div id=profile> <span>InfluxDB URL: </span> <p>{{ influxUrl }}</p> </div>
          <div id=profile> <span>Organization: </span> <p>{{ orgName }}</p> </div>
          <div id=profile> <span>Your Token: </span> <p>{{ influxToken }}</p> </div>
          <div class="buttons">
            <button id="logout" @click="logout">Logout</button>
          </div>
        </div>
      </main>
      <main v-else class="main-content">
        <div>
          <h1>Welcome to InfluxDB No-code Interface!</h1>
          <h3>Please log in to use full functionality.</h3>
          <div class="buttons">
            <button @click="goToLogin" class="login-button">Login with your InfluxDB token</button>
            <button @click="defaultConfigLogin" class="default-button">Default Config Login</button>
          </div>
        </div>
      </main>
    </div>
  `
});

app.mount('#app');
