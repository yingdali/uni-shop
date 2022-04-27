<template>
	<view>
	<!-- 		搜索组件 -->
	<view class="search-box">
		<my-search @click=gotosearch()></my-search>
	</view>

	<!-- 	轮播图区域 -->
	<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
		<swiper-item v-for="(item,i) in swiperList" :key="i">
			<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
				<image :src="item.image_src"></image>
			</navigator>
		</swiper-item>
	</swiper>
	
	<!-- 	这是分类导航区域 -->
		<view class="nav-list">
			   <view class="nav-item" v-for="(item,i) in navList" :key="i"  @click="navClickHandler(item)" >
			     <image  class="nav-img" :src="item.image_src"></image>
			   </view>
		</view>
	
<!-- 	楼层区域 -->
	<view class="floor-list">
		<view class="floor-item" v-for="(item,i) in floorList" :key="i">
			<image :src="item.floor_title.image_src" class="floor-title"></image>
<!-- 			楼层的图片区域 -->
			<view class="left-image-box">
				<navigator class="left-image-box" :url="item.product_list[0].url">
					<image :src="item.product_list[0].image_src" :style="{width:item.product_list[0].image_width+'rpx'}" mode="widthFix"></image>
				</navigator>
				<view class="right-image-box" >
					<navigator v-for="(item2,i2) in item.product_list" :key="i2" v-if="i2!==0" :url="item2.url">
						<image :src="item2.image_src" mode="widthFix" :style="{width:item2.image_width+'rpx'}"></image>
					</navigator>
				</view>
			</view>
		</view>
	</view>	
	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//这是轮播图的数据列表
				swiperList:[],
				//分类导航的数据列表
				navList:[],
				//楼层的数据
				floorList:[]
			};
		},
		onLoad() {
			//调用方法获取轮播图数据
			this.getSwiperList()
			//调用方法获取分类导航数据
			this.getNavList()
			//调用获取楼层数据方法
			this.getfloorList()
		},
		methods:{
			//获取轮播图数据
		    async	getSwiperList(){
				const {data:res}=await uni.$http.get('/api/public/v1/home/swiperdata')
				//res中解构出一个data属性重命名为res
				//请求失败 return出去 然后调用uni.$showMsg()方法
				if(res.meta.status!==200) return uni.$showMsg()
				this.swiperList=res.message
			},
			//获取分类导航的数据
			async getNavList(){
				const {data:res}=await uni.$http.get('/api/public/v1/home/catitems')
				if(res.meta.status!==200) return uni.$showMsg()
				this.navList=res.message
			},
			//点击分类导航的事件
		    navClickHandler(item){
				if(item.name==='分类'){
					console.log(item);
					uni.switchTab({
						url:'/pages/cart/cart'
					})
				}
			},
			//获取楼层数据方法
			async getfloorList(){
				const{data:res}=await uni.$http.get('/api/public/v1/home/floordata')
				if(res.meta.status!==200) return uni.$showMsg()
				//点击图片跳转商品列表页，因做了分包"navigator_url"地址不是实际路径地址，因此对动态数据进行处理
				res.message.forEach(floor=>{
					// console.log(floor);
					//floor,prod都是自命名的循环后的对象
					floor.product_list.forEach(prod=>{
						//为prod挂载url属性，split('?')[1]以？进行分割分割后的第一项
						prod.url='/subpkg/goods_list/goods_list?'+prod.navigator_url.split('?')[1]
					})
				})
				this.floorList=res.message
				
			},
			//导航跳转页面
			gotosearch(){
				uni.navigateTo({
					url:'../../subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
swiper{
	height: 330rpx;
	//为swiper下的每一个.swiper-item，image都能撑满父容器
	.swiper-item,
	image{
		width: 100%;
		height: 100%;
	}
}
.nav-list{
	display: flex;
	justify-content: space-around;
	margin: 15px;
	
	.nav-img{
		width: 128rpx;
		height: 140rpx;
	}
}
.floor-title{
	width: 100%;
	height: 60rpx;
}
.left-image-box{
	display: flex;
	padding-left: 10rpx;
}
	
.right-image-box{
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
}
.search-box {
  // 设置定位效果为“吸顶”
  position: sticky;
  // 吸顶的“位置”
  top: 0;
  // 提高层级，防止被轮播图覆盖
  z-index: 999;
}
</style>
