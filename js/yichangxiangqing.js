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
    allProvince:[{adnm:"海南省"},
      {adnm:"海口市"},{adnm:"三亚市"},{adnm:"五指山"},{adnm:"琼海市"},{adnm:"儋州市"},{adnm:"文昌市"},
      {adnm:"万宁市"},{adnm:"东方市"},{adnm:"定安县"},{adnm:"屯昌县"},{adnm:"澄迈县"},{adnm:"临高县"},
      {adnm:"白沙县"},{adnm:"昌江县"},{adnm:"乐东县"},{adnm:"陵水县"},{adnm:"保亭县"},{adnm:"琼中县"}
    ],
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
      this.$http.get(this.url)
      .then((response)=>{
        console.log("异常数据首页数据请求成功!");
        this.datas=response.body.sort(strSort);
        // 表格背景添加颜色
        this.setTableBGActive();
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
    setTableBGActive:function(){
      var _this=this;
      _this.datas.forEach(function(item, index){
        if(index%2==0){
          Vue.set(item,'navActive',false);
        }else{
          Vue.set(item,'navActive',true);
        }
      })
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
    
  }
})