
export const option1 = {
  xAxis: {
    type: 'category',
    data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
  },
  yAxis: {
    type: 'value'
  },
  title: {
    text: '一星期的在线人数',
    left: 'center'
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    }
  ]
}

export const option = {
  title: {
    text: '所有学校在线答题情况',
    subtext: '学校人数',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '当前在线人数',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: '江西冶金职业技术学院' },
        { value: 735, name: '新余学院' },
        { value: 580, name: '电子科技大学' },
        { value: 484, name: '山东服装职业技术学院' },
        { value: 300, name: '江西工程学院' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}
