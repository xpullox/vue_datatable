<template>
  <div>
    <div class="mb-1">
      <b-row align-v="center" align-h="between" no-gutters>
        <b-col>
          <div>
            Displaying
            {{ Math.min((currentPage - 1) * perPage + 1, totalItems) }}
            -
            {{ Math.min(currentPage * perPage, totalItems) }}
            of
            {{ totalItems }} results
          </div>
        </b-col>
        <b-col cols="auto">
          <b-button variant="link" @click="showEditColumns">
            Edit Columns
          </b-button>
        </b-col>
      </b-row>
    </div>
    <b-table-simple striped>
      <b-thead>
        <b-tr>
          <b-th v-for="column in selectedColumns" :key="column.id">
            <b-row
              align-v="center"
              class="flex-nowrap cursor-pointer no-user-select"
              no-gutters
              @click="onSelectColumnToSort(column)"
            >
              <b-col cols="auto" class="pr-2">
                {{ column.title }}
              </b-col>
              <b-col>
                <b-img
                  v-show="sortBy.column === column.name && sortBy.order === 'ascending'"
                  src="~/assets/images/chevron-down-solid.svg"
                  width="10"
                  height="10"
                />
                <b-img
                  v-show="sortBy.column === column.name && sortBy.order === 'descending'"
                  src="~/assets/images/chevron-up-solid.svg"
                  width="10"
                  height="10"
                />
              </b-col>
            </b-row>
          </b-th>
        </b-tr>
        <b-tr>
          <b-th v-for="(column, c) in selectedColumns" :key="column.id">
            <b-row :no-gutters="column.tooltip">
              <b-col :cols="column.tooltip ? 10 : 12">
                <v-select v-if="column.type === 'select'" v-model="column.filter" :multiple="column.multiple" :options="column.values" @input="applyColumnFilters" />
                <custom-datetime-picker v-else-if="column.type === 'date'" :change-date-val="changeFilterDate" :id-str="column.name" :param="`${c}`" />
                <b-form-input v-else v-model="column.filter" @input="applyColumnFilters" />
              </b-col>
              <b-col v-if="column.tooltip" cols="2" class="d-flex align-items-center">
                <b-icon :id="`tooltip-target-${column.name}`" icon="exclamation-circle-fill" variant="dark" class="ml-2" />
                <b-popover
                  v-if="column.tooltip_html"
                  ref="popover"
                  :show.sync="popoverShow"
                  :target="`tooltip-target-${column.name}`"
                  triggers="click"
                  placement="top"
                >
                  <template #title>
                    <b-button class="close ml-1 pop-close" aria-label="Close" @click="onTooltipClose">
                      <span class="d-inline-block" aria-hidden="true">&times;</span>
                    </b-button>
                    Possible HTML
                  </template>
                  <b-row>
                    <!-- eslint-disable vue/no-v-html -->
                    <b-col v-html="column.tooltip_content" />
                    <!--eslint-enable-->
                  </b-row>
                </b-popover>
                <b-tooltip v-else :target="`tooltip-target-${column.name}`" triggers="hover">
                  {{ column.tooltip_content }}
                </b-tooltip>
              </b-col>
            </b-row>
          </b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <b-tr v-for="item in pageItems" :key="item.id">
          <b-td v-for="column in selectedColumns" :key="column.id">
            <b-link v-if="column.type === 'link'" :href="item['_cellVariants'][column.name]['url']" :target="item['_cellVariants'][column.name]['target']">
              {{ item[column.name] }}
            </b-link>
            <b-link v-else-if="column.type === 'email'" :href="`mailto:${item[column.name]}`">
              {{ item[column.name] }}
            </b-link>
            <template v-else>
              {{ item[column.name] }}
            </template>
          </b-td>
        </b-tr>
        <b-tr v-if="pageItems.length === 0">
          <b-td :colspan="selectedColumns.length">
            <div class="text-center text-muted p-3">
              No items...
            </div>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalItems"
      :per-page="perPage"
      align="right"
      @change="onPageChange"
    />
    <b-modal id="edit-columns-modal" title="Select Columns" no-close-on-backdrop scrollable>
      <draggable v-model="columnsToEdit" v-bind="dragOptions">
        <transition-group type="transition">
          <div v-for="column in columnsToEdit" :key="column.id" class="cursor-move my-1">
            <b-card no-body>
              <b-card-body class="px-1 py-1">
                <b-form-checkbox v-model="column.selected">
                  {{ column.title }}
                </b-form-checkbox>
              </b-card-body>
            </b-card>
          </div>
        </transition-group>
      </draggable>
      <template #modal-footer>
        <div class="w-100">
          <b-row align-v="center" align-h="between">
            <b-col cols="auto">
              <b-button variant="success" @click="applySelectedColumns">
                Apply
              </b-button>
            </b-col>
            <b-col cols="auto">
              <b-button variant="secondary" @click="$bvModal.hide('edit-columns-modal')">
                Cancel
              </b-button>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import columnsSample from 'static/temp/columns.json'
import dataSample from 'static/temp/sample-data.json'
import draggable from 'vuedraggable'

export default {
  name: 'DataTable',
  components: {
    draggable
  },
  props: {
    useSampleData: {
      type: Boolean
    }
  },
  data () {
    return {
      allColumns: [],
      columnsToEdit: [],
      selectedColumns: [],
      totalItems: 0,
      pageItems: [],
      currentPage: 1,
      perPage: 8,
      dragOptions: {
        animation: 200
      },
      sortBy: {
        column: '',
        order: 'ascending'
      },
      popoverShow: false
    }
  },
  created () {
    if (this.useSampleData) {
      this.allColumns = columnsSample
      this.selectedColumns = this.allColumns.filter(item => item.selected)
      this.totalItems = dataSample.length
      this.loadPageItems(this.currentPage)
    }
  },
  methods: {
    onPageChange (page) {
      this.loadPageItems(page)
    },
    loadPageItems (page) {
      const filteredItems = dataSample.filter((item) => {
        return this.selectedColumns.every((column) => {
          if (!column.filter) {
            return true
          }

          if (column.filter.trim().length > 0) {
            if (column.type === 'select') {
              if (String(item[column.name]) !== String(column.filter)) {
                return false
              }
            } else if (!String(item[column.name]).toLowerCase().includes(column.filter.toLowerCase())) {
              return false
            }
          }

          return true
        })
      }).sort((a, b) => {
        const columnName = this.sortBy.column
        if (columnName) {
          const order = this.sortBy.order === 'ascending' ? 1 : -1
          return String(a[columnName]).localeCompare(String(b[columnName])) * order
        } else {
          return 0
        }
      })
      this.totalItems = filteredItems.length
      this.pageItems = filteredItems.slice((page - 1) * this.perPage, page * this.perPage)
    },
    showEditColumns () {
      this.$bvModal.show('edit-columns-modal')
      this.columnsToEdit = JSON.parse(JSON.stringify(this.allColumns))
    },
    applySelectedColumns () {
      this.$bvModal.hide('edit-columns-modal')
      this.allColumns = JSON.parse(JSON.stringify(this.columnsToEdit))
      this.selectedColumns = this.allColumns.filter(item => item.selected)
      this.sortBy.column = ''
      this.loadPageItems(this.currentPage)
    },
    applyContext (ctx, column) {
      const dateAry = ctx.split('-')
      column.filter = `${dateAry[1]}/${dateAry[2]}/${dateAry[0]}`
      this.applyColumnFilters()
    },
    changeFilterDate (ind, value) {
      // eslint-disable-next-line no-console
      // console.log('col-ind', ind, 'date-val', value)
      this.selectedColumns[ind].filter = value
      this.applyColumnFilters()
    },
    applyColumnFilters () {
      this.loadPageItems(this.currentPage)
    },
    onSelectColumnToSort (column) {
      if (this.sortBy.column === column.name) {
        if (this.sortBy.order === 'ascending') {
          this.sortBy.order = 'descending'
        } else {
          this.sortBy.column = ''
        }
      } else {
        this.sortBy.column = column.name
        this.sortBy.order = 'ascending'
      }
      this.loadPageItems(this.currentPage)
    },
    onTooltipClose () {
      this.popoverShow = false
    }
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.cursor-move {
  cursor: move;
}

.no-user-select {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}
</style>
<style>
.vs__search, .vs__search:focus {
  line-height: 1.65 !important;
}

.vs__dropdown-toggle {
  border: 1px solid #ced4da !important;
}

.vs__dropdown-menu li {
  font-weight: normal !important;
}

.pop-close {
  line-height: 17px;
}
</style>
