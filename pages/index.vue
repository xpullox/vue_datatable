<template>
  <b-container fluid="xs">
    <div class="text-center mt-3">
      <h1>Customers Table</h1>
    </div>
    <div class="my-3 px-2">
      <b-card no-body>
        <b-card-body class="shadow-sm">
          <data-table :use-sample-data="true" />
        </b-card-body>
      </b-card>
    </div>
  </b-container>
</template>

<script>
export default {}
</script>
