# Project Description

This project is Nuxt app which is using [bootstrap-vue](https://bootstrap-vue.org/docs) to show the data table component I created in action.

You can check the working component live from this [page](https://vue-datatable.vercel.app/).

Here are some explanations about the [data table component](components/DataTable.vue) I created.

I have used `b-table-simple` component from `bootstrap-vue` which is a simplified version of `b-table`. `b-table` component comes with pagination, sorting, filtering support, but they are not perfect enough. So I have created the component with `b-table-simple` and implemented the pagination, sorting, filtering by myself, so it's flexible to apply further customizations.

Usually the vue app lifecycle in Laravel project is a little different from the Nuxt app, but this [data table component](components/DataTable.vue) can be used in Laravel project without a big headache.

The 3rd party dependencies for this table component are the followings.

- [bootstrap-vue](https://bootstrap-vue.org/docs)
- [vue-draggable](https://github.com/SortableJS/Vue.Draggable)

In Laravel, there are sometimes headaches with Vue. For example, the `app.js` getting fatter, code splitting does not make much sense about modules, server side rendering does not work, and so on. The Laravel mix is still not good enough I think.

As of now, the data table component uses the sample data. In the component, there is a method - `loadPageItems` which will need to be updated to load data from API.

You can actually check the sample json files - [columns.json](static/temp/columns.json) and [sample-data.json](static/temp/sample-data.json) which will give you an idea about how I'm expecting the response json format should be.

Anyway please go through the component I created, the playground page, and then let me know about what you think.

Thank you




