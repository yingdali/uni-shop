<template>
	<view>
		 <view class="scroll-view-container">
		      <!-- 左侧的滚动视图区域 -->
		      <scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
				<block v-for="(item,i) in catList" :key="i">
					<view :class="['left-scroll-view-item',i===active?'active':'']" @click="activeChange(i)">{{item.cat_name}}</view>
				</block>

		 
		      </scroll-view>
		      <!-- 右侧的滚动视图区域 -->
		      <scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
		        <view class="cate-lv2" v-for="(item2,i) in cateLevel2" :key="i">
				<!-- 	二级分类的标题 -->
					<view class="cate-lv2-title">{{item2.cat_name}}</view>
				<!--    三级分类列表 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
							<image :src="item3.cat_icon"></image>
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
		      </scroll-view>
		    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			// 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
				wh:0,
				//列表数据
				catList:[],
				//记录选中
				active:0,
				//二级分类列表
				cateLevel2:[],
				//解决切换选项卡不回到顶部
				scrollTop:0
			};
		},
		onLoad() {
			//获取当前系统的信息
			const sysInfo=uni.getSystemInfoSync()
			//获取当前可用高度，去除了tabbar和导航栏
			this.wh=sysInfo.windowHeight
			
			this.getCateList()
		},
		methods:{
			//获取分类列表的数据
			async getCateList(){
				const {data:res}=await uni.$http.get('/api/public/v1/categories')
				if(res.meta.status!==200)return uni.$showMsg()
				this.catList=res.message
				//为二级分类赋值 默认项
				this.cateLevel2=res.message[0].children
			},
			activeChange(i){
				this.active=i
				//重新为二级分类赋值
				this.cateLevel2=this.catList[i].children
				//为scrolltop是0就赋值为1，不是0就赋值为0
				this.scrollTop=this.scrollTop===0?1:0
			},
			// 点击三级分类项跳转到商品列表页面
			gotoGoodsList(item3){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?cid='+item3.cat_id
				})
			}
		}
	}
</script>

<style lang="scss">
.scroll-view-container {
  display: flex;

  .left-scroll-view {
    width: 120px;

    .left-scroll-view-item {
      line-height: 60px;
      background-color: #f7f7f7;
      text-align: center;
      font-size: 12px;

      // 激活项的样式 有上面的类&是同时有active类名时
      &.active {
        background-color: #ffffff;
        position: relative;

        // 渲染激活项左侧的红色指示边线
        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
.cate-lv2-title {
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  padding: 15px 0;
}

.cate-lv3-list {
  display: flex;
  flex-wrap: wrap;

  .cate-lv3-item {
    width: 33.33%;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    image {
      width: 60px;
      height: 60px;
    }

    text {
      font-size: 12px;
    }
  }
}
</style>
