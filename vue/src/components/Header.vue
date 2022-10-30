<template>
  <div>
    <b-navbar toggleable="lg" type="dark" :variant="isMoody ? 'dark' : 'secondary'">
      <b-navbar-brand>Moody Quotes</b-navbar-brand>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    isMoody: Boolean,
  },
};
</script>
