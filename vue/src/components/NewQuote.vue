<template>
  <b-form @submit="onSubmit">
    <b-container>
      <b-row class="my-4">
        <b-col sm="11">
          <b-form-input v-model="text" placeholder="Write your soul out..." required></b-form-input>
        </b-col>
        <b-col sm="1">
          <b-button type="submit" variant="info">Create</b-button>
        </b-col>
      </b-row>
    </b-container>
  </b-form>
</template>

<script>
export default {
  name: "NewQuote",
  data() {
    return {
      text: "",
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      const quote = {
        text: this.text,
      }
      this.$emit("create-quote", quote);
      this.clearForm();
    },
    clearForm() {
      this.text = "";
    }
  }
}
</script>
