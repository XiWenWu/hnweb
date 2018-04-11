// 给市县排序
var strSort=function(x,y){
  if(x.adcd>y.adcd){
    return 1;
  }else{
    return -1;
  }
}
// 站点余额
var ycxq=new Vue({
  el:"#ycxq",
  data:{
    // 导航栏数据
    titles:[
      {nav:"服务器状态",url:"fuwuqizhuangtai.html"},
      {nav:"站点状态",url:"zhandianzhuangtai.html"},
      {nav:"站点余额",url:"zhandianyue.html"},
      {nav:"异常数据",url:"yichangshuju.html",active:true},
      {nav:"维护日历",url:"weihurili.html"}
    ],
    // 总数据
    datas:[],
    // 省份数据 每次切换省份的时候需要更新
    shenData:[],
    // 表格数据 每次点击查询、
    tableData:[],
    // 默认选择的市县
    selected:"海南省",
    // 异常类型
    typeYiChang:[
      {type:"全部",active:true},
      {type:"水位突变",active:false},
      {type:"水位长期不变",active:false},
      {type:"雨量长期为0",active:false},
      {type:"雨量冒大数",active:false},
      {type:"电压低于12V",active:false},
      {type:"电压走低",active:false},
      {type:"GPRS数据不全",active:false},
      {type:"卫星数据不全",active:false},
    ],
    // index 默认进入后的显示页面  
    index:1,
    // limit 翻页插件显示的能点击的按钮个数（必须是单数）
    limit:9, 
    // size 总的信息条数
    size:20,
    // 上一页是否显示
    showPrevMore : false,
    // 下一页是否显示
    showNextMore : false,
    // 市县信息 
    allProvince:JSON.parse(localStorage.getItem("allProvinceAdnm")),
    // 站点余额-详情
    url:"/svrapi/alnormal/getAlnormalByTm"
  },
  // 计算属性
  computed:{
    //计算总页码
    pages(){
      return Math.ceil(this.size / this.limit)
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
  // 观察属性
  watch:{
    selected:function(){
      console.log(this.selected);
      // 根据选中的市县筛选数据
      var _this=this;
      var adcd="";
      var subData=[];
      if(_this.selected=="海南省"){
        subData=_this.datas;
      }else{
        // 遍历获取adcd
        _this.allProvince.forEach(function(item, index){
          if(item.adnm==_this.selected){
            adcd=item.adcd.substring(0,6);
          }
        })
        // 当adcd为海口三亚的时候只去前4位
        if(adcd==460100 || adcd==460200){
          adcd=adcd.substring(0,4);
          _this.datas.forEach(function(item, index){
            if(item.adcd.substring(0,4)==adcd){
              subData.push(item);
            }
          })
        }else{
          _this.datas.forEach(function(item, index){
            if(item.adcd.substring(0,6)==adcd){
              subData.push(item);
            }
          })
        }
      }
      _this.setTableBGActive(subData);
      _this.shenData=subData;
      _this.tableData=_this.shenData;
    }
  },
  // 
  mounted(){
    // 异常数据=>基础数据
    // http://hnyw.cloudowr.cn/svr/stmgr/getAllStYeJf
    // 获取网络数据
    this.getYiChangXiangQingData(); 
  },
  updated(){
    // 页面加载后执行
    window.parent.document.getElementById("rightIframe").style.height=document.body.offsetHeight+20+"px";
  },
  methods:{
    getYiChangXiangQingData:function(){
      // 获取本地缓存
      this.datas=JSON.parse(localStorage.getItem("yiChangXiangQingData"))
      this.$http.get(this.url)
      .then((response)=>{
        console.log("异常数据首页数据请求成功!");
        this.datas=response.body.sort(strSort);
        // 本地缓存
        localStorage.setItem("yiChangXiangQingData", JSON.stringify(this.datas));
        // 表格背景添加颜色
        this.setTableBGActive(this.datas);
        //设置表格数据
        this.setTableData();
        //设置表格数据
        this.setDataTypeStation();
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
    // 表格背景颜色添加
    setTableBGActive:function(data){
      data.forEach(function(item, index){
        if(index%2==0){
          Vue.set(item,'navActive',false);
        }else{
          Vue.set(item,'navActive',true);
        }
      })
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
        this.$emit('change', this.index)
      }
    },
    // 返回异常数据页面
    backTo:function(){
      document.location.href="yichangshuju.html"  
    },
    // 设置表格数据
    setTableData:function(){
      var _this=this;
      // 获取当前页面的html 然后
      var subData=[];
      var adcd=document.location.href.substring(document.location.href.length-6,document.location.href.length);
      _this.allProvince.forEach(function(item, index){
        if(item.adcd.substring(0,6)==adcd){
          _this.selected=item.adnm;
        }
      })
      _this.datas.forEach(function(item, index){
        if(adcd==460100 || adcd==460200){
          var subAdcd=adcd.substring(0,4);
          if(item.adcd.substring(0,4)==subAdcd){
            subData.push(item);
          }
        }else{
          if(item.adcd.substring(0,6)==adcd){
            subData.push(item);
          }
        }
      })
      _this.setTableBGActive(subData);
      _this.shenData=subData;
      _this.tableData=_this.shenData;
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
    // 查询
    searchTableData:function(){
      var _this=this;
      var yiChang="";
      _this.typeYiChang.forEach(function(item,index){
        if(item.active){
          yiChang=item.type;
        }
      })
      var subData=[];
      _this.shenData.forEach(function(item,index){
        if(yiChang=="全部"){
          subData=_this.shenData;
        }else if(yiChang=="水位突变"){
          if(item.typetext=="水位突变"){
            subData.push(item);
          }
        }else if(yiChang=="水位长期不变"){
          if(item.typetext=="水位长期不变"){
            subData.push(item);
          }
        }else if(yiChang=="雨量长期为0"){
          if(item.typetext=="雨量长期不变"){
            subData.push(item);
          }
        }else if(yiChang=="雨量冒大数"){
          if(item.typetext=="雨量冒大数"){
            subData.push(item);
          }
        }else if(yiChang=="电压低于12V"){
          if(item.typetext=="电压低于12"){
            subData.push(item);
          }
        }else if(yiChang=="电压走低"){
          if(item.typetext=="电压走低"){
            subData.push(item);
          }
        }else if(yiChang=="GPRS数据不全"){
          if(item.typetext=="GPRS数据不全"){
            subData.push(item);
          }
        }else if(yiChang=="卫星数据不全"){
          if(item.typetext=="卫星数据不全"){
            subData.push(item);
          }
        }
      })
      _this.setTableBGActive(subData);
      _this.tableData=subData;
    },
    //
    changeTypeYiChang:function(index){
      this.typeYiChang.forEach(function(item,index){
        item.active=false;
      })
      this.typeYiChang[index].active=true;
    },
  }
})