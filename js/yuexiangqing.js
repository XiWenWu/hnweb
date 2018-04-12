// 给市县排序
var strSort=function(x,y){
  if(x.adcd>y.adcd){
    return 1;
  }else{
    return -1;
  }
}
// 站点余额
var yexq=new Vue({
  el:"#yexq",
  data:{
    // 导航栏数据
    titles:[
      {nav:"服务器状态",url:"fuwuqizhuangtai.html"},
      {nav:"站点状态",url:"zhandianzhuangtai.html"},
      {nav:"站点余额",url:"zhandianyue.html",active:true},
      {nav:"异常数据",url:"yichangshuju.html"},
      {nav:"维护日历",url:"weihurili.html"}
    ],
    // 总数据
    datas:[],
    // 省份数据 每次切换省份的时候需要更新
    shenData:[],
    // 表格数据 每次点击查询、
    tableData:[],
    // 当前显示的表格数据
    tableDataShow:[],
    // index 默认进入后的显示页面  
    index:1,
    // limit 翻页插件显示的能点击的按钮个数（必须是单数）
    limit:9, 
    // 每页显示条数
    value:10,
    // size 总的信息条数
    size:20,
    // 上一页是否显示
    showPrevMore : false,
    // 下一页是否显示
    showNextMore : false,
    // 市县信息 
    allProvince:JSON.parse(localStorage.getItem("allProvinceAdnm")),
    // 设备类型
    typeStation:[
      {type:"全部",active:true},
      {type:"水位站",active:false},
      {type:"图像站",active:false},
      {type:"雨量站",active:false},
      {type:"预警站",active:false},
    ],
    // 余额范围
    typeYue:[
      {type:"全部",active:true},
      {type:"欠费超20元",active:false},
      {type:"欠费20元以内",active:false},
      {type:"余额0~20元",active:false},
      {type:"余额20~50元",active:false},
      {type:"余额50元以上",active:false},
    ],
    selected:"海南省",
    // 站点余额-详情
    url:"/svrrt/stmgr/getAllStYeJf"
  },
  // 计算属性
  computed:{
    //计算总页码
    pages(){
      return Math.ceil(this.size / this.value)
    },
    //计算页码，当count等变化时自动计算
    pagers(){
      const array = []
      // 显示可以点击的页数个数，多余的用 ... 代替  必须是单数
      const perPages = this.limit
      // 计算显示的总页数
      const pageCount = this.pages
      // 当前选中的页数
      let current = this.index
      const _offset = (perPages - 1) / 2


      const offset = {
        start : current - _offset,
        end   : current + _offset
      }

      //-1, 3
      if (offset.start < 1) {
        offset.end = offset.end + (1 - offset.start)
        offset.start = 1
      }
      if (offset.end > pageCount) {
        offset.start = offset.start - (offset.end - pageCount)
        offset.end = pageCount
      }
      if (offset.start < 1) offset.start = 1

      this.showPrevMore = (offset.start > 1)
      this.showNextMore = (offset.end < pageCount)

      for (let i = offset.start; i <= offset.end; i++) {
        array.push(i)
      }
      return array
    }
  },
  // 
  mounted(){
    // 异常数据=>基础数据
    // http://hnyw.cloudowr.cn/svr/stmgr/getAllStYeJf
    // 获取网络数据
    this.getYuEXiangQingData(); 
  },
  updated(){
    // 页面加载后执行
    window.parent.document.getElementById("rightIframe").style.height=document.body.offsetHeight+20+"px";
  },
  watch:{
    selected:function(){
      console.log(this.selected);
      // 根据选中的市县筛选数据
      var _this=this;
      var adcd="";
      var data=[];
      if(_this.selected=="海南省"){
        data=_this.datas;
      }else{
        _this.datas.forEach(function(item, index){
          if(item.adnm==_this.selected){
            data.push(item);
          }
        })
      }
      // _this.setTableBGActive(data);
      _this.shenData=data;
      _this.tableData=_this.shenData;
      _this.index=1;
      _this.setTableDataShowData(1,_this.value);
    },
    //当tableData数据变动后调整翻页插件
    tableData:function(){
      var _this=this;
      _this.size=_this.tableData.length;
    },
    // 页面显示的信息条数
    value:function(){
      var _this=this;
      _this.index=1;
      _this.setTableDataShowData(1,_this.value);
    },
  },
  methods:{
    getYuEXiangQingData:function(){
      this.datas=JSON.parse(localStorage.getItem("yuEXiangQingLocalData"))
      this.$http.get(this.url)
      .then((response)=>{
        console.log("异常数据首页数据请求成功!");
        this.datas=response.body.sort(strSort);
        if(response){
          localStorage.setItem("yuEXiangQingLocalData", JSON.stringify(this.datas));
        }
        // ZZ 水位站 JJ 图像站 PP 雨量站  WF 预警站
        this.setDataTypeStation();
        // 设置需要显示的信息
        this.setTableData();
      })
      .catch(function(response){
        console.log("异常数据首页数据请求失败!");
        console.log(response)
      })
    },
    // 导航点击添加class
    navSelectStyle:function (item, index) {
      var _this=this;
      _this.$nextTick(function () {
        _this.titles.forEach(function (item) {
          Vue.set(item,'active',false);
        });
        Vue.set(item,'active',true);
      });
      // 页面跳转
      window.parent.document.getElementById("rightIframe").src="page/"+item.url;
    },
    // 设置表格显示的当前数据
    setTableDataShowData:function(page,value){
      var _this=this;
      var data=[];
      var min=value*(page-1);
      // 计算最大值 不能超出数组范围
      var max=value*page<_this.tableData.length?value*page:_this.tableData.length;
      for(var i=min; i<max; i++){
        data.push(_this.tableData[i]);
      }
      _this.tableDataShow=_this.setTableBG(data);
    },
    // ZZ 水位站 JJ 图像站 PP 雨量站  WF 预警站
    setDataTypeStation:function(){
      var _this=this;
      _this.datas.forEach(function(item,index){
        if(item.sttp=="ZZ"){
          Vue.set(item,"station","水位站");
        }else if(item.sttp=="JJ"){
          Vue.set(item,"station","图像站");
        }else if(item.sttp=="PP"){
          Vue.set(item,"station","雨量站");
        }else if(item.sttp=="WF"){
          Vue.set(item,"station","预警站");
        }
      })
    },
    // 设置需要显示的信息
    setTableData:function(){
      var _this=this;
      //获取页面URL中附带的adcd
      var url=document.location.href;
      var adcd="";
      var subData=[];
      // 如果url中带有adcd字段
      if(url.indexOf("adcd")>0){
        adcd=url.substring(url.length-6,url.length)
        _this.datas.forEach(function(item, index){
          if(adcd==460100 || adcd==460200){
            if(item.adcd.substring(0,4)==adcd.substring(0,4)){
              subData.push(item);
            }
          }else{
            if(item.adcd.substring(0,6)==adcd){
              subData.push(item);
            }
          }
        })
        // 设置select
        _this.allProvince.forEach(function(item,index){
          if(item.adcd.substring(0,6)==adcd){
            _this.selected=item.adnm;
          }
        })
        _this.shenData=subData;
        _this.tableData=_this.shenData;
      }else{
        _this.shenData=_this.datas;
        _this.tableData=_this.shenData;
      } 
      // 表格背景添加颜色
      // _this.setTableBGActive(_this.tableData);
      _this.index=1
      _this.setTableDataShowData(1,_this.value)
    },
    // 表格背景颜色添加
    setTableBG:function(data){
      var _this=this;
      if(data){
        data.forEach(function(item, index){
          if(index%2==0){
            Vue.set(item,'navActive',false);
          }else{
            Vue.set(item,'navActive',true);
          }
        })
      }
      return data;
    },
    // 翻页插件方法
    prev(){
      if (this.index > 1) {
        this.go(this.index - 1)
      }
    },
    next(){
      if (this.index < this.pages) {
        this.go(this.index + 1)
      }
    },
    first(){
      if (this.index !== 1) {
        this.go(1)
      }
    },
    last(){
      if (this.index != this.pages) {
        this.go(this.pages)
      }
    },
    go (page) {
      if (this.index !== page) {
        this.index = page
        //父组件通过change方法来接受当前的页码
        this.$emit('change', this.index);
        console.log("第"+page+"页");
        this.setTableDataShowData(page,this.value);
      }
    },
    // 返回站点余额页面
    backTo:function(){
      document.location.href="zhandianyue.html"
    },
    //
    changeTypeStation:function(index){
      this.typeStation.forEach(function(item,index){
        item.active=false;
      })
      this.typeStation[index].active=true;
    },
    //
    changeTypeYue:function(index){
      this.typeYue.forEach(function(item,index){
        item.active=false;
      })
      this.typeYue[index].active=true;
    },
    // 筛选页面数据
    searchTableData:function(){
      var station="";
      var yue="";
      var _this=this;
      // 获取筛选的条件
      _this.typeStation.forEach(function(item,index){
        if(item.active){
          station=item.type;
        }
      })
      _this.typeYue.forEach(function(item,index){
        if(item.active){
          yue=item.type;
        }
      })
      console.log(station+"-"+yue);
      var subData=[];
      if(station=="全部"&&yue=="全部"){
        subData=_this.shenData;
      }else if(station=="全部"){
        _this.shenData.forEach(function(item, index){
          if(yue=="欠费超20元"){
            if(item.account<-20){
              subData.push(item);
            }
          }else if(yue=="欠费20元以内"){
            if(item.account<0 && item.account>=-20){
              subData.push(item);
            }
          }else if(yue=="余额0~20元"){
            if(item.account<20 && item.account>=0){
              subData.push(item);
            }
          }else if(yue=="余额20~50元"){
            if(item.account<50 && item.account>=20){
              subData.push(item);
            }
          }else if(yue=="余额50元以上"){
            if(item.account>=50){
              subData.push(item);
            }
          }
        })
      }else if(yue=="全部"){
        _this.shenData.forEach(function(item, index){
          if(item.station==station){
            subData.push(item);
          }
        })
      }else{
        _this.shenData.forEach(function(item, index){
          if(item.station==station && yue=="欠费超20元"){
            if(item.account<-20){
              subData.push(item);
            }
          }else if(item.station==station && yue=="欠费20元以内"){
            if(item.account<0 && item.account>=-20){
              subData.push(item);
            }
          }else if(item.station==station && yue=="余额0~20元"){
            if(item.account<20 && item.account>=0){
              subData.push(item);
            }
          }else if(item.station==station && yue=="余额20~50元"){
            if(item.account<50 && item.account>=20){
              subData.push(item);
            }
          }else if(item.station==station && yue=="余额50元以上"){
            if(item.account>=50){
              subData.push(item);
            }
          }
        })
      }
      // _this.setTableBGActive(subData);
      _this.tableData=subData;
      _this.index=1;
      _this.setTableDataShowData(1,_this.value);
    },
    
  }
})