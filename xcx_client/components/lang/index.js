Component({
  properties: {
    tip: {         
      type: String,     // 类型（必填）,包括：String, Number, Boolean, Object, Array, null
      value: ''         // 属性初始值（可选）
    },
  },
  data: {
    lang: ['中文', '英文'],
    langArray: [
      { id: 0, name: '中文' },
      { id: 1, name: '英文' }
    ],
    index: 0,
  },
  methods: {
    bindPickerChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        index: e.detail.value
      })
    },
  }
})
