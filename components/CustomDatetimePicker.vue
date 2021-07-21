<!--suppress JSUnresolvedVariable -->
<template>
  <b-input-group :id="`custom-bootstrap-picker-${idStr}`">
    <b-form-input :id="`custom-bootstrap-picker-input-${idStr}`" v-model="dateVal" @input="changeDateVal(param, dateVal)" @blur="loseFocus" />
    <b-input-group-append>
      <b-button variant="secondary" @mouseover="hovered = true" @mouseout="hovered = false" @click="openPicker">
        <b-icon icon="calendar2-fill" @click="openPicker" />
      </b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
export default {
  name: 'CustomDatetimePicker',
  props: {
    date: {
      type: String,
      required: false,
      default: ''
    },
    idStr: {
      type: String,
      required: true,
      default: 'custom'
    },
    changeDateVal: {
      type: Function,
      required: true,
      default: () => {}
    },
    param: {
      type: String,
      required: false,
      default: () => 'model'
    }
  },
  data: () => ({
    dateVal: '',
    hovered: false
  }),
  created () {
    this.$bus.$on(`date-${this.idStr}-picker`, this.changeValue)
  },
  beforeDestroy () {
    this.$bus.$off(`date-${this.idStr}-picker`, this.changeValue)
  },
  mounted () {
    if (this.date) {
      this.dateVal = this.date
    }

    // eslint-disable-next-line no-undef
    $(`#custom-bootstrap-picker-input-${this.idStr}`).datetimepicker({
      format: 'mm/dd/yyyy hh:ii',
      autoClose: true
    }).on('changeDate', (e) => {
      // eslint-disable-next-line no-undef,no-console
      const inputEl = $(`#custom-bootstrap-picker-input-${this.idStr}`)
      inputEl.blur()

      this.changeDateVal(this.param, inputEl.val())
    })
  },
  methods: {
    changeValue (value) {
      this.dateVal = value
    },
    loseFocus () {
      // eslint-disable-next-line no-undef,no-console
      console.log($(`#custom-bootstrap-picker-input-${this.idStr}`).val())
    },
    openPicker () {
      // eslint-disable-next-line no-undef
      $(`#custom-bootstrap-picker-input-${this.idStr}`).focus()
    }
  }
}
</script>

<style scoped>

</style>
