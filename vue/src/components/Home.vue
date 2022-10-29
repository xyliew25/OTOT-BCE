<template>
  <div class="container">
    <NewQuote @create-quote="createQuote" />
    <Quotes :quotes="quotes" @edit-quote="editQuote" @delete-quote="deleteQuote" />
  </div>
</template>

<script>
import NewQuote from "./NewQuote.vue";
import Quotes from "./Quotes.vue";
import { getQuotes, createQuote, editQuote, deleteQuote } from "../services/QuoteService";

export default {
  name: "Home",
  components: {
    NewQuote,
    Quotes,
  },
  data() {
    return {
      quotes: [],
    }
  },
  methods: {
    async getQuotes() {
      this.quotes = await getQuotes();
    },
    async createQuote(quote) {
      const newQuote = await createQuote(quote);
      this.quotes = [...this.quotes, newQuote];
    },
    async editQuote(id, quote) {
      const editedQuote = await editQuote(id, quote);
      this.quotes = this.quotes.map((quote) => quote.id === id ? editedQuote : quote);
    },
    async deleteQuote(id) {
      await deleteQuote(id);
      this.quotes = this.quotes.filter((quote) => quote.id !== id);
    },
  },
  mounted() {
    this.getQuotes();
  },
};
</script>
