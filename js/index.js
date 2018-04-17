  // 给市县排序
  var strSort=function(x,y){
    if(x.adcd>y.adcd){
      return 1;
    }else{
      return -1;
    }

  }
  var leftNav=new Vue({
    el:"#leftNav",
    data:{
      allProvince:[],
      url:"http://hnyw.cloudowr.cn/svrapi/getAllSvrStatus"
    },
    // 
    mounted(){
      document.getElementById("rightIframe").style.width=(document.documentElement.clientWidth-220)+"px";
      document.getElementById("rightIframe").style.height=(document.documentElement.clientWidth-220)+"px";
      this.getAllServerStatus()
    },
    methods:{
      getAllServerStatus:function(){
        this.$http.get(this.url)
        .then((response)=>{
          this.allProvince=response.body.sort(strSort);
          // 在本地储存市县的adnm
          this.setAllProvinceAdnm();
        })
        .catch(function(response){
          console.log(response)
        })
      },
      selectStyle:function (item, index) {
        var _this=this;
        _this.allProvince.forEach(function (item) {
          Vue.set(item,'active',false);
        });
        Vue.set(item,'active',true);
        var srcUrl="http://"+_this.allProvince[index].host+_this.allProvince[index].home+"&adcd="+_this.allProvince[index].adcd;
        if(index==0){
          document.getElementById("rightIframe").src="page/fuwuqizhuangtai.html"
        }else{
          document.getElementById("rightIframe").src=srcUrl
        }
        // url="http://"+datas[i].host+datas[i].home+"&adcd="+datas[i].adcd
      },
      setAllProvinceAdnm:function(){
        var _this=this;
        var allProvinceAdnm=[];
        _this.allProvince.forEach(function(item, index){
          var sub={};
          sub.adcd=item.adcd;
          sub.adnm=item.adnm;
          allProvinceAdnm.push(sub);
          Vue.set(item,'active',false);
        })
        _this.allProvince[0].active=true;
        localStorage.setItem("allProvinceAdnm", JSON.stringify(allProvinceAdnm));
      },
    }
  })
  // 水雨情弹出框
  var stationDetail=new Vue({
    el:"#stationDetail",
    data:{
      showDiv:true,
      datas:[],
      titles:[
        {nav:"水位站",url:"",active:true},
        {nav:"雨量站",url:""},
        {nav:"图像站",url:""},
        {nav:"水位站",url:""},
        {nav:"雨量站",url:""},
        {nav:"图像站",url:""},
      ],
      // 雨量统计类型
      typeRainfall:[
        {type:"时段雨量",rtype:0,active:true},
        {type:"小时雨量",rtype:1,active:false},
        {type:"日雨量",rtype:2,active:false},
      ],
      // 时段雨量
      rainfallPart:[0,0,0,0,0,10,20,20,0,0],
      // 小时雨量
      rainfallHour:[0,0,10,0,0,10,20,20,0,0],
      // 日雨量
      rainfallDay:[0,0,0,0,0,10,20,20,0,0],
      date:[
        "04-07 08:00",
        "04-08 08:00",
        "04-09 08:00",
        "04-10 08:00",
        "04-11 08:00",
        "04-12 08:00",
        "04-13 08:00",
        "04-14 08:00",
        "04-15 08:00",
        "04-16 08:00",
        "04-17 08:00",
      ],
      nowDate:"2018-04-17",
      lastDate:"2018-04-07",
      url:"",
    },
    // 
    computed:{
      // 时段雨量累计
      rainfallPartTotal:function(){
        var data=[];
        var value=0;
        this.rainfallPart.forEach(function(item,index){
          if(item>0){
            value+=item;
          }
          data.push(value);
        })
        return data;
      },
      // 小时雨量累计
      rainfallHourTotal:function(){
        var data=[];
        var value=0;
        this.rainfallHour.forEach(function(item,index){
          if(item>0){
            value+=item;
          }
          data.push(value);
        })
        return data;
      },
      // 日雨量累计
      rainfallDayTotal:function(){
        var data=[];
        var value=0;
        this.rainfallDay.forEach(function(item,index){
          if(item>0){
            value+=item;
          }
          data.push(value);
        })
        return data;
      },
    },
    methods:{
      getAllData:function(){

      },
      navSelectStyle:function(item, index){
        var _this=this;
        _this.$nextTick(function () {
          _this.titles.forEach(function (item) {
            Vue.set(item,'active',false);
          });
          Vue.set(item,'active',true);
        });
      },
      changeTypeStation:function(index){
        this.typeRainfall.forEach(function(item){
          item.active=false;
        })
        this.typeRainfall[index].active=true;
      },
      setMapRainfall:function(){
        var mapRainfall=echarts.init(document.getElementById("mapRainfall"))
        mapRainfall.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
          }
        },
        grid:{
          top:50,
          right:40,
          bottom:30,
          left:40
        },
        legend: {
          data:['雨量','累计雨量']
        },
        xAxis: [
          {
            type: 'category',
            data: this.date,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '雨量(mm)',
            min: 0,
          },
          {
            type: 'value',
            name: '累计雨量(mm)',
            min: 0,
          }
        ],
        series: [
            {
              name:'雨量',
              type:'bar',
              data:this.rainfallDay
            },
            {
              name:'累计雨量',
              type:'line',
              yAxisIndex: 1,
              data:this.rainfallDayTotal
            }
        ],
        color:["#009de0","#000000"]
      })
      },
    }
  })

