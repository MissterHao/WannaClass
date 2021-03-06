const { ipcRenderer } = require("electron");
const { BackendService } = require("./js/yzu_backend");
const Enumerable = require("./js/linq")
const { ref, onMounted, onUpdated, computed, watch } = Vue;
var apibackend = new BackendService()

const fs = require('fs');
var settingFilePath = "settings.json"
let settings = JSON.parse(fs.readFileSync(settingFilePath))

var sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database('db.sqlite');


var year_now = new Date().getFullYear() - 1911;
var smtr_now = new Date().getMonth() >= 7 ? 1 : 2;

function saveSettingFile(){
	fs.writeFileSync(settingFilePath, JSON.stringify(settings))
}

const app = Vue.createApp({
	el: '#app',
	//   delimiters: ['@{', '}'],
	setup() {
		/**
		 * Variables
		 */
		const sid = ref("");
		const spwd = ref("");

		const greetings = ref("")

		const isLoading = ref(false);  // 是否
		const loading_text = ref("");

		const login_infomation = ref({}); // 儲存登入資訊
		const std_account_infomation = ref({}); // 儲存學生資訊
		const notify_list = ref([]);
		const dept_list = ref([]); // 總學校系級


		// School Timetable Query
		const queryType = ref("dept")  // 欲搜尋的類型
		const querySelectQueryYear = ref(`${year_now}`)  // 欲搜尋的學年
		const querySelectQuerySmt = ref(`${smtr_now}`)  // 欲搜尋的學期
		const querySelectQueryDept = ref("")  // 欲搜尋的系級

		const queryInputQueryCourseName = ref("")  // 欲搜尋的課程名稱

		const queryInputQueryTeacherName = ref("")  // 欲搜尋的教師名稱

		const querySelectQueryDay = ref("1")   // 欲搜尋的星期
		const querySelectQueryPeriod = ref("01")  // 欲搜尋的課堂時間

		const queryResultForList = ref([]) // 用於儲存已查詢到的課程列表
		const modalCourse = ref({}) // 用於儲存點擊的 Course Info 並顯示於 Modal 中
		var CourseList = []; // 總課程列表

		// Task List
		const tasks = ref([]);

		// Settings
		const StealCourseInterval = ref(settings.interval); // 選課時間間隔
		const StealCourseStage = ref(settings.stage); // 選課時間間隔

		/**
		 * Functions
		 */
		// 登入並取得學生名字
		function login() {
			if (sid.value !== "" && spwd.value !== "") {

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
						settings["token"] = login_infomation.value["Token"]
						saveSettingFile()
						return service._getAppLoginccount()
					}).then((service) => {
						std_account_infomation.value = service.std_account_infomation[0]
						getCourseList()
						getNotifyList()


						setTimeout(() => {
							isLoading.value = false;
							loading_text.value = "";
							document.querySelector(".login-panel").classList.add("slide-up")

							setTimeout(() => {
								document.querySelector(".login-panel").style.display = "none";
								document.querySelector(".login-panel").classList.remove("slide-up")
							}, 2000);

							// 顯示首頁
							showSectionById("Main")

						}, 2000)

					})
			}
		}

		function showSection(id) {
			showSectionById(id)
		}

		function getCourseList() {

			loading_text.value = "下載課程資料中~";
			isLoading.value = true;

			apibackend.getCourseListFromYZUApi(`${querySelectQueryYear.value}`, `${querySelectQuerySmt.value}`).then((data) => {
				CourseList = data.course_list;
				dept_list.value = data.dept_list;

				loading_text.value = "下載完成";
				isLoading.value = false;
			})

		}

		function getNotifyList() {
			apibackend.getNotifyList().then((service) => {
				notify_list.value = service.notify_list;
				var el = document.querySelector('.content-panel__notifylist');
				SimpleScrollbar.initEl(el);
			})
		}

		function query(qtype, ...args) {
			if (qtype == "dept") {
				var a = Enumerable.from(CourseList)
					.where((x) => { return x.year == args[0] && x.smtr == args[1] && x.dept_name.includes(args[2]) })
					.select("$")
					.toArray();
				queryResultForList.value = a;
			} else if (qtype == "courseName") {
				var a = Enumerable.from(CourseList)
					.where((x) => { return x.name == args[0] })
					.select("$")
					.toArray();
				queryResultForList.value = a;
			} else if (qtype == "teacherName") {
				var a = Enumerable.from(CourseList)
					.where((x) => {
						if (x.teacher_name === null) return false;

						return x.teacher_name.includes(args[0])
					}

					)
					.select("$")
					.toArray();
				queryResultForList.value = a;
			} else if (qtype == "courseTime") {
				var time = args[0] + args[1];
				var a = Enumerable.from(CourseList)
					.where((x) => {
						if (x.time === null) return false;
						return x.time.includes(time)
					}
					)
					.select("$")
					.toArray();
				queryResultForList.value = a;
			}
		}

		watch([querySelectQueryYear, querySelectQuerySmt], ([newYear, newSmt], [prevYear, prevSmt]) => {
			getCourseList()
		})
		watch(querySelectQueryDept, (newDept, prevDept) => {
			query(queryType.value, querySelectQueryYear.value, querySelectQuerySmt.value, newDept)
		})
		watch([querySelectQueryDay, querySelectQueryPeriod,], ([newDay, newPeriod], [prevDay, prevPeriod]) => {
			query(queryType.value, newDay, newPeriod)
		})
		watch(queryInputQueryCourseName, (newCN, prevCN) => {
			query(queryType.value, newCN)
		})
		watch(queryInputQueryTeacherName, (newTN, prevTN) => {
			query(queryType.value, newTN)
		})
		watch(queryType, (newqueryType, prevqueryType) => {

			// querySelectQueryYear.value = ""
			// querySelectQuerySmt.value = ""
			querySelectQueryDept.value = ""

			queryInputQueryCourseName.value = ""

			queryInputQueryTeacherName.value = ""

			querySelectQueryDay.value = "1"
			querySelectQueryPeriod.value = "01"

			queryResultForList.value = []
		})

		watch(StealCourseInterval, (newInterval, prevInterval) => {
			settings["interval"] = parseInt(newInterval)
			saveSettingFile()
			ipcRenderer.send("regetSettings", {})
		})

		watch(StealCourseStage, (newStage, prevStage) => {
			settings["stage"] = newStage
			saveSettingFile()
			ipcRenderer.send("regetSettings", {})
		})

		function addToSchedule(event, course) {
			event.preventDefault()
			event.stopPropagation()
			// 通知 worker 加入搶課列表
			var course_obj = JSON.parse(JSON.stringify(course))
			console.log(course_obj);
			ipcRenderer.send("addTaskCourse", course_obj)

		}

		function showCourseInfo(course) {
			modalCourse.value = course;
			document.querySelector("#MHmodal").checked = true;
		}

		function status(s) {
			if (s == 0) {
				return "尚未選到"
			} else if (s == 1) {
				return "已選到！恭喜！"
			} else if (s == 2) {
				return "此課程已選過喔！"
			} else {
				return `其他未明狀態 狀態碼 ${s}`
			}
		}

		onUpdated(() => { })

		onMounted(() => {
			setInterval(() => {
				database.all(`SELECT * FROM tasks`, [], (err, rows) => {
					if (err) {
						throw err;
					}
					tasks.value = rows
				});
			}, 5000)


			document.addEventListener('DOMContentLoaded', function () {
				// var options = {};
				// var elems = document.querySelectorAll(".tap-target");
				// var instances = M.TapTarget.init(elems, options);

				var options = {};
				var elems = document.querySelectorAll('.modal');
				var instances = M.Modal.init(elems, options);
			})
		})

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
			showSection,
			// School Timetable Query
			addToSchedule, showCourseInfo,
			queryType, querySelectQueryYear, querySelectQuerySmt, querySelectQueryDept, queryInputQueryCourseName,
			queryInputQueryTeacherName, querySelectQueryDay, querySelectQueryPeriod, queryResultForList, modalCourse,
			// Task List 
			tasks, status,
			// Settings
			StealCourseInterval, StealCourseStage,
		}
	}
});

app.mount('#app')
