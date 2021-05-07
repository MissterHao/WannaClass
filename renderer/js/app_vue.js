const { BackendService } = require("./js/yzu_backend");
const Enumerable = require("./js/linq")
const JsSearch = require("js-search")
const { ref, onMounted, onUpdated, computed, watch } = Vue;
var apibackend = new BackendService()

const app = Vue.createApp({
	el: '#app',
	//   delimiters: ['@{', '}'],
	setup() {
		/**
		 * Variables
		 */
		const sid = ref(sconfig.sid);
		const spwd = ref(sconfig.spwd);

		const greetings = ref("")

		const isLoading = ref(false);  // 是否
		const loading_text = ref("");

		const login_infomation = ref({}); // 儲存登入資訊
		const std_account_infomation = ref({}); // 儲存學生資訊
		const notify_list = ref([]);
		const dept_list = ref([]); // 總學校系級


		// School Timetable Query
		const queryType = ref("dept")  // 欲搜尋的類型
		const querySelectQueryYear = ref("109")  // 欲搜尋的學年
		const querySelectQuerySmt = ref("2")  // 欲搜尋的學期
		const querySelectQueryDept = ref("資訊工程學系學士班")  // 欲搜尋的系級

		const queryInputQueryCourseName = ref("")  // 欲搜尋的課程名稱

		const queryInputQueryTeacherName = ref("")  // 欲搜尋的教師名稱

		const querySelectQueryDay = ref("1")   // 欲搜尋的星期
		const querySelectQueryPeriod = ref("01")  // 欲搜尋的課堂時間

		const queryResultForList = ref([]) // 用於儲存已查詢到的課程列表
		const modalCourse = ref({}) // 用於儲存點擊的 Course Info 並顯示於 Modal 中
		var CourseList = []; // 總課程列表

		/**
		 * Functions
		 */
		// 登入並取得學生名字
		function login() {
			if (sid.value !== "" && spwd.value !== "") {
				console.log(sid.value, spwd.value);

				loading_text.value = "登入中";
				isLoading.value = true;


				apibackend._getRSAKey()
					.then((service) => {
						return service._encryptData(sid.value, spwd.value)
					})
					.then((service) => {
						return service._getUserAccessToken()
					}).then((service) => {


						login_infomation.value = service.login_infomation;
						return service._getAppLoginccount()
					}).then((service) => {
						std_account_infomation.value = service.std_account_infomation
						getCourseList()
						getNotifyList()


						setTimeout(() => {
							isLoading.value = false;
							loading_text.value = "";
							document.querySelector(".login-panel").classList.add("slide-up")

							// 顯示首頁
							showSectionById("Main")
							showSectionById("School-timetable-Query")

						}, 2000)

					})
			}
		}


		function getCourseList() {
			// apibackend.getCourseSchedule("109", 2)
			apibackend.getCourseListFromYZUApi("109", "2").then((data) => {
				CourseList = data.course_list;
				dept_list.value = data.dept_list;
				var search = new JsSearch.Search("hashid");

				/**
				 * WeekandRoom: "506(體育場地),507(體育場地),"
					cd_prompt: null
					ci_prompt: "中語一配班授課 (限一年級該班學生)。第三階段開放選課，退選請洽體育室。"
					cos_class: "J "
					cos_id: "PL101 "
					cos_type_name: "共同必修"
					credit: 0
					dept_name: "體育室                        "
					name: "體育"
					smtr: "2  "
					teacher_id: "wu1968"
					teacher_name: "吳政文"
					year: "109"
				 */
				search.addDocuments(CourseList);
			})

		}

		function getNotifyList() {
			apibackend.getNotifyList().then((service) => {
				notify_list.value = service.notify_list;
				var el = document.querySelector('.content-panel__notifylist');
				SimpleScrollbar.initEl(el);
			})
		}

		function query(qtype, ...args){
			if(qtype == "dept"){
				var a = Enumerable.from(CourseList)
					.where((x)=>{ return  x.year == args[0] && x.smtr == args[1] && x.dept_name.includes(args[2])})
					.select("$")
					.toArray();

				
				console.log(a);
				console.log(a.length);

				queryResultForList.value = a;

			}else if(qtype == "courseName"){

			}else if(qtype == "teacherName"){

			}else if(qtype == "courseTime"){

			}
		}

		watch([querySelectQueryYear, querySelectQuerySmt, querySelectQueryDept,], ([newYear, newSmt, newDept], [prevYear, prevSmt, prevDept])=>{
			console.log("[newYear, newSmt, newDept], [prevYear, prevSmt, prevDept]", [newYear, newSmt, newDept], [prevYear, prevSmt, prevDept]);
			query(queryType.value, newYear, newSmt, newDept)
		})

		// watch([a, b], ([newA, newB], [prevA, prevB]) => {
		// 	// do whatever you want
		//   });



		onUpdated(() => {})


		return {
			// Util UI variable 
			greetings,


			// student login infomation
			sid, spwd, login, 
			// student infomation
			std_account_infomation,
			notify_list,
			// UI controlling
			isLoading, loading_text, 
			dept_list,


			// School Timetable Query
			queryType, querySelectQueryYear, querySelectQuerySmt, querySelectQueryDept, queryInputQueryCourseName, 
			queryInputQueryTeacherName, querySelectQueryDay, querySelectQueryPeriod, queryResultForList, modalCourse,
		}

	}
});



// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// tag name should be small case
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// app.component("course-list-item", {
//     props: ['course', ],
//     template: `
//     <tr course="course" @click="showInfo" data-toggle="collapse" :data-target="'#demo-' +course.hashid" :data-hashid="course.hashid" class="accordion-toggle">
//         <td>{{course.name}}</td>
//         <td>{{course.teacher_name}}</td>
//         <td>{{course.cos_type_name}}</td>
//         <td>{{course.credit}}</td>
//         <td>{{course.dept_name}}</td>
//         <td> <span @click.capture.self="addToSchedule" class="btn hvr-bounce-to-right">加入選課清單</span> </td>
//     </tr>
//     `,

//     data :function(){
//         return {
//             mcourse: this.course, 
//             index: 0,
//             hashid: "", 
//         }
//     },

//     methods: {
//         showInfo(event){
//             console.log("showInfo");
//             this.$emit('showcourseinfotoparent', event.target.parentNode.dataset.hashid, this.course);
//         },
        
//         addToSchedule(event){
//             console.log("Add to Schedule");
//             alertify.set({ delay: 1000 });
//             alertify.success("已加入選課清單！");
            
//             ipcRenderer.send(CHANNEL_NAME.TELL_MAIN_ADD_SCHEDULE_ITEM, {
//                 course: this.course,
//                 status: 0,
//                 time: 5
//             })


//             event.preventDefault()
//             event.stopPropagation()
//         }
//     }
// })


app.mount('#app')
