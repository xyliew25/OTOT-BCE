<template>
  <b-table bordered :items="quotes" :fields="fields" responsive="sm" head-variant="dark">
    <template #cell(edit)="row">
      <b-button variant="outline-secondary" size="sm" @click="row.toggleDetails(); populateText(row.item.id, row.item.text);" class="mr-2">
        <b-icon icon="x" v-if="row.detailsShowing"></b-icon>
        <b-icon icon="pencil-square" v-if="!row.detailsShowing"></b-icon>
      </b-button>
    </template>
    <template #cell(delete)="row">
      <b-button variant="outline-danger" size="sm" @click="deleteQuote(row.item.id);" class="mr-2">
        <b-icon icon="trash"></b-icon>
      </b-button>
    </template>
  
    <template #row-details="row">
      <b-form @submit="row.toggleDetails(); editQuote($event, row.item.id);">
        <b-container>
          <b-row class="my-4">
            <b-col sm="11">
              <b-form-input v-model="texts[row.item.id]" required></b-form-input>
            </b-col>
            <b-col sm="1">
              <b-button type="submit" variant="outline-secondary">
                <b-icon icon="pencil"></b-icon>
              </b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-form>
    </template>
  </b-table>
</template>
  
<script>
export default {
  name: "Quotes",
  props: {
    quotes: Array,
  },
  data() {
    return {
      fields: [
        {
          key: "text",
          label: "Quote",
        }, 
        "author",
        "edit",
        "delete",
      ],
      texts: {},
    }
  },
  methods: {
    populateText(id, text) {
      this.texts[id] = text;
    },
    editQuote(e, id) {
      e.preventDefault();
      const quote = {
        text: this.texts[id],
      }
      this.$emit('edit-quote', id, quote);
    },
    deleteQuote(id) {
      this.$emit('delete-quote', id);
    },
  },
}
</script>
