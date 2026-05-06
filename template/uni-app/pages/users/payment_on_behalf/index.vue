<template>
	<view class="main" :style="colorStyle">
		<view class="head" v-if="!resData.paid">
			<view class="user-img"><image :src="resData.avatar" mode="aspectFill"></image></view>
			<view class="order-status">代付订单已创建，请尽快发送给好友~</view>
		</view>

		<view class="order-msg">
			<view class="pay--box" v-if="!resData.paid">
				<view class="order-top">待付金额</view>
				<view class="order-num"><text class="icon">¥</text>{{resData.pay_price}}</view>
			</view>

			<view class="order-btn-wrapper" v-if="!resData.paid">
				<view v-if="isWeixin" class="launch-btn-container">
					<wx-open-launch-weapp
						id="launch-btn"
						username="gh_41ab7a957e0c"
						:path="'pages/users/payment_on_behalf/index.html?order_id=' + order_id"
						style="width: 100%; display: block;"
					>
						<script type="text/wxtag-template">
							<style>
								.btn { 
									width: 100%; height: 45px; line-height: 45px; text-align: center;
									background: #e93323; color: #fff; border: none; 
									border-radius: 22px; font-size: 16px; 
								}
							</style>
							<button class="btn">微信内：点我跳小程序</button>
						</script>
					</wx-open-launch-weapp>
				</view>

				<button v-else class="order-btn" @tap="browserJump">
					浏览器：点我唤起微信
				</button>
				
				<view class="tip-text">点击上方按钮将直接跳转小程序页面</view>
			</view>
		</view>

		<view class="order-list">
			<orderGoods :cartInfo="resData.cartInfo" :is_confirm='true' :pay_price="resData.pay_price" :is_behalf="true"></orderGoods>
		</view>
	</view>
</template>

<script>
	import orderGoods from '@/components/orderGoods';
	import colors from "@/mixins/color";
	import { friendDetail } from '@/api/user.js';
	// #ifdef H5
	import jweixin from 'weixin-js-sdk';
	// #endif

	export default {
		mixins: [colors],
		components: { orderGoods },
		data() {
			return {
				order_id: '',
				resData: { cartInfo: [] },
				isWeixin: false
			}
		},
		onLoad(option) {
			this.order_id = option.order_id;
			this.isWeixin = /MicroMessenger/i.test(navigator.userAgent);
		},
		onShow() {
			this.getDetail();
		},
		methods: {
			getDetail() {
				friendDetail(this.order_id).then(res => {
					this.resData = res.data.info;
					if (this.isWeixin) this.initWechatConfig();
				});
			},
			initWechatConfig() {
				const url = location.href.split('#')[0];
				// 替换为你真实的后端配置接口
				uni.request({
					url: '/api/wechat/getWxConfig', 
					data: { url: url },
					success: (res) => {
						const data = res.data;
						jweixin.config({
							debug: false,
							appId: data.appId,
							timestamp: data.timestamp,
							nonceStr: data.nonceStr,
							signature: data.signature,
							openTagList: ['wx-open-launch-weapp']
						});
					}
				});
			},
			browserJump() {
				uni.showLoading({ title: '正在唤起微信...' });
				uni.request({
					url: '/api/wechat/getScheme', 
					method: 'POST',
					data: {
						path: '/pages/users/payment_on_behalf/index',
						query: 'order_id=' + this.order_id
					},
					success: (res) => {
						if (res.data.openlink) {
							window.location.href = res.data.openlink;
						} else {
							uni.showToast({ title: '链接生成失败', icon: 'none' });
						}
					},
					complete: () => uni.hideLoading()
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main { background-color: #f5f5f5; min-height: 100vh; padding-bottom: 40rpx; }
	.head {
		background-color: #e93323; padding: 60rpx 30rpx 80rpx; display: flex; flex-direction: column; align-items: center; color: #fff;
		.user-img image { width: 100rpx; height: 100rpx; border-radius: 50%; border: 4rpx solid #fff; }
		.order-status { margin-top: 20rpx; font-size: 28rpx; }
	}
	.order-msg {
		background-color: #fff; border-radius: 14rpx; margin: -30rpx 30rpx 0; padding: 40rpx 0;
		display: flex; flex-direction: column; align-items: center;
		.order-num { font-size: 66rpx; font-weight: bold; color: #333; margin-bottom: 20rpx; .icon { font-size: 32rpx; } }
		.order-btn-wrapper { width: 90%; }
		.order-btn {
			width: 100%; height: 90rpx; line-height: 90rpx; background-color: #e93323;
			border-radius: 45rpx; color: #fff; font-size: 30rpx;
		}
		.launch-btn-container { width: 100%; height: 90rpx; }
		.tip-text { font-size: 22rpx; color: #999; margin-top: 20rpx; text-align: center; }
	}
	.order-list { margin: 30rpx; border-radius: 14rpx; overflow: hidden; }
</style>