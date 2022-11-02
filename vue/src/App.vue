<template>
  <div id="app">
    <Header :isMoody="isMoody" />
    <Home :isMoody="isMoody" />
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Home from "./components/Home.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Header,
    Home,
    Footer,
  },
  data() {
    return {
      isMoody: true,
    }
  },
  methods: {
    getLocation() {
      const successCallback = async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        await this.getIsRaining(lat, lon);
      };
      navigator.geolocation.getCurrentPosition(successCallback);
    },
    async getIsRaining(lat, lon) {
      const ISRAININGAWSURL = "https://4s7t36l57r3v25ki3egen4dg340yicsq.lambda-url.ap-southeast-1.on.aws/";
      const res = await fetch(ISRAININGAWSURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat, lon }),
      });
      const json = await res.json();
      this.isMoody = json.isRaining;
      console.log("isRaining: " + json.isRaining);
    }
  },
  mounted() {
    this.getLocation();
  },
}
</script>
