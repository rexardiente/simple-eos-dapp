<template>
  <span>
    <v-app-bar app color="black green" dark>
      <v-spacer class="hidden-md-and-up"></v-spacer>
      <v-toolbar-title>{{appTitle}}</v-toolbar-title>
    </v-app-bar>
  </span>
</template>

<script>
export default {
  name: 'AppTopBar',
  data() {
    return {
      appTitle: 'My EOS Dapp'
    };
  }
};
</script>

<style scoped>

</style>
