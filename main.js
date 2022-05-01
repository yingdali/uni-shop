
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
// 1. 导入 store 的实例对象
import store from '@/store/store.js'

//引入uni插件
import {uniBadge} from '@dcloudio/uni-ui'
//import uniBadge from '@dcloudio/uni-ui/lib/uni-badge/uni-badge.vue' //也可使用此方式引入组件
export default {
    components: {uniBadge}
}

//导入网络请求的包
import { $http } from '@escook/request-miniprogram'
//为uni挂载$http属性
uni.$http = $http

//请求的根路径
$http.baseUrl='http://api-ugo-web.itheima.net'


//配置请求拦截器
$http.beforeRequest =function(options){
	uni.showLoading({
		title:'数据加载中...'
	})	
}
//响应拦截器
$http.afterRequest =function(options){
	uni.hideLoading({
		title:'数据加载中...'
	})	
}

//封装弹窗的方法 function里是定义的默认值，showToast是uni自带方法 duration是默认弹窗时间
uni.$showMsg=function(title='数据请求失败',duration=1500,iocon='none'){
	uni.showToast({
		title,
		duration,
		iocon
	})
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	// 2. 将 store 挂载到 Vue 实例上
	store,
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app,
    // 2. 将 store 挂载到 Vue 实例上
    store,
  }
}
// #endif