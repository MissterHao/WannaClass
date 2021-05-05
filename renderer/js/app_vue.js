const { BackendService } = require("./js/yzu_backend");
const { ref, onMounted, onUpdated, computed } = Vue;
var apibackend = new BackendService()

const app = Vue.createApp({
	el: '#app',
	//   delimiters: ['@{', '}'],
	setup(){

		const sid = ref(sconfig.sid);
		const spwd = ref(sconfig.spwd);

		const isLoading = ref(false);  // 是否
		const loading_text= ref("");

		const login_infomation = ref({}); // 儲存登入資訊
		const std_account_infomation = ref({}); // 儲存學生資訊
		const notify_list = ref([]);


		// 登入並取得學生名字
		function login(){
			if(sid.value !== "" && spwd.value !== ""){
				console.log(sid.value, spwd.value);

				loading_text.value = "登入中";
				isLoading.value = true;
				

				apibackend._getRSAKey()
				.then((service) => {
					return service._encryptData(sid.value, spwd.value)
				})
				.then((service) => {
					return service._getUserAccessToken()
				}).then((service)=>{

					
					login_infomation.value = service.login_infomation;
					return service._getAppLoginccount()
				}).then((service)=>{
					std_account_infomation.value = service.std_account_infomation
					getCourseList()
					getNotifyList()

					
					setTimeout(()=>{
						isLoading.value = false;
						loading_text.value = "";
						document.querySelector(".login-panel").classList.add("slide-up")
					}, 2000)

				})
			}
		}


		function getCourseList(){
			apibackend.getCourseSchedule("109", 2)
		}

		function getNotifyList(){
			apibackend.getNotifyList().then((service)=>{
				notify_list.value = service.notify_list;
			})
		}


		return {
			// student login infomation
			sid, spwd, login,
			// student infomation
			std_account_infomation,
			notify_list,
			// UI controlling
			isLoading, loading_text,
		}

	}
});

app.mount('#app')