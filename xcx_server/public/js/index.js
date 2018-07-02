$('button').on('click', function () {
  console.log('click')
});

let data = {name: 'iwen', age:18}
let url = 'http://localhost:1234/data'
$.ajax({
  type: "post",
  url: url,
  async: true,
  data: {
    "name": "iwen"
  },
  success: function (res) {
    console.log(res)
  }
});