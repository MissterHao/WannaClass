const crypto = require('crypto');
const request = require("request")
const { default: Axios } = require("axios")
const NodeRSA = require('node-rsa');
const moment = require("moment")


class BackendService {
    constructor(sid, spwd) {
        this.root_url = "https://portalx.yzu.edu.tw/NewPortal/"
        this.AcademicWebAPIurl = "https://portal.yzu.edu.tw/AcademicWebAPI/"

        this.urls = {
            getUserAccessTokenUrl: "api/Auth/UserAccessToken",
            getRSAAPIKeyByAPPIDUrl: "api/Auth/RSAkeybyAppID",
        }

        this.ALLDATA = {
            // User Data
            "account": "",
            "password": "",
            // App Data
            "AppId": "XamPrismYzu20180206",
            "BackUID": "",
            "DeviceSerial": "123", // JBAXB7616580PZJ
            "APIkey": "YzuAppCall",
            "Password": "!@#$_YzuApp_IS5201",

            "PublicKeyXml": "",

            // Header
            "Accept": "application/json"
        }



        this.sid = sid;
        this.spwd = spwd;

        this._setSidSpwd(sid, spwd)



        this.AcademicWebAPIurl = "https://portal.yzu.edu.tw/AcademicWebAPI/"
        this.portalOpenAPIurl = "https://portalx.yzu.edu.tw/OpenData/"
        this.portalOpenAPI = {
            "News": "api/Open/YzuNews",
            "CosList": "api/Open/CosList?year=%s&smtr=%s",
            "CosListByTeacher": "api/Open/CosListByTeacher?TeacherName=%s",
        }


    }

    loginService(sid, spwd) {
        this._setSidSpwd(sid, spwd)

        yzuService.getRSAKey()
            .then((service) => {
                return service.encryptData(loginConfig.account, loginConfig.password)
            })
            .then((service) => {
                return service.getUserAccessToken()
            })

        return true;
    }

    _setSidSpwd(sid, spwd) {
        this.ALLDATA["account"] = sid;
        this.ALLDATA["password"] = spwd;
    }




    _getRSAKey() {
        var url = "https://portalx.yzu.edu.tw/NewPortal/" + "api/Auth/RSAkeybyAppID"
        var ss = this.ALLDATA["APIkey"] + ":" + this.ALLDATA["Password"]

        var payload = {
            "AppId": this.ALLDATA["AppId"],
            "Content-Type": "application/x-www-form-urlencoded",
        }
        var headers = {
            "Accept": "application/json",
            "Authorization": "Basic " + Buffer.from(ss).toString('base64'),
        }

        // 存起來 以後就不用再算了
        this.ALLDATA["Authorization"] = headers["Authorization"]
        this.ALLDATA["Accept"] = headers["Accept"]

        var params = new URLSearchParams()
        params.append("AppId", this.ALLDATA["AppId"])
        params.append("Content-Type", "application/x-www-form-urlencoded")


        var that = this

        return Axios.post(url, params, {
            headers: headers
        }).then((respones) => {
            console.log("---------- RSA")
            that.ALLDATA["PublicKeyXml"] = respones.data["RSAkey"]
            that.ALLDATA["Modulus"] = respones.data["Modulus"]
            that.ALLDATA["Exponent"] = respones.data["Exponent"]
            // that.ALLDATA["Modulus"]  = toBigIntBE(Buffer.from(respones.data["Modulus"], "base64"))
            // that.ALLDATA["Exponent"] = toBigIntBE(Buffer.from(respones.data["Exponent"], "base64"))


            return new Promise(function (resolve, reject) {
                return resolve(that)
            })

        }).catch((error) => {
            // console.error(error)
        })


    }

    _encryptData(account, password) {

        console.log("---------- Login")

        this._setSidSpwd(account, password)

        var key = new NodeRSA()
        key.setOptions({ encryptionScheme: "pkcs1" });

        key.importKey({
            n: Buffer.from(this.ALLDATA["Modulus"], "base64"),
            e: 65537,
        }, 'components-public');

        this.ALLDATA["account"] = key.encrypt(Buffer.from(account, "ascii"), "base64")
        this.ALLDATA["password"] = key.encrypt(Buffer.from(password, "ascii"), "base64")

        var that = this
        return new Promise(function (resolve, reject) {
            return resolve(that)
        })
    }

    _getUserAccessToken() {
        console.log("---------- getUserAccessToken");

        var url = "https://portalx.yzu.edu.tw/NewPortal/" + "api/Auth/UserAccessToken"

        var payload = new URLSearchParams()
        payload.append("AppId", this.ALLDATA["AppId"])
        payload.append("account", this.ALLDATA["account"])
        payload.append("password", this.ALLDATA["password"])
        payload.append("BackUID", this.ALLDATA["BackUID"])
        payload.append("DeviceSerial", this.ALLDATA["DeviceSerial"])


        var headers = {
            "Accept": this.ALLDATA["Accept"],
            "Authorization": this.ALLDATA["Authorization"]
        }


        var that = this

        return Axios.post(url, payload, {
            headers: headers
        }).then((response) => {

            if (response.data.Result.includes("失敗")) {
                return Promise.reject(new Error("解密失敗"))
            }

            this.login_infomation = response.data;

            this.ALLDATA["Token"] = response.data["Token"]
            this.ALLDATA["UserStatus"] = response.data["UserStatus"]

            var that = this;
            // 繼續 promise 的 chain
            return new Promise(function (resolve, reject) {
                return resolve(that)
            })

        })

    }

    _getLoginAccount() {
        var url = "https://isdna1.yzu.edu.tw/StdSelWebAPI/api/SelCos/Get_LoginAccount_Str"

        var payload = new URLSearchParams()
        payload.append("sToken", this.ALLDATA["Token"])


        var headers = {
            "Accept": this.ALLDATA["Accept"],
            // "Authorization": this.ALLDATA["Authorization"]
        }


        return Axios.post(url, payload, {
            headers: headers
        }).then((response) => {

            console.log(response)



            var that = this;
            // 繼續 promise 的 chain
            return new Promise(function (resolve, reject) {
                return resolve(that)
            })

        })
    }

    _getAppLoginccount() {
        var url = "https://portal.yzu.edu.tw/StdWebAPI/api/CheckAppAccessToken20190216/GetAppAccount"

        var payload = new URLSearchParams()
        payload.append("Token", this.ALLDATA["Token"])
        payload.append("Lang", "zh")


        var headers = {
            "Accept": this.ALLDATA["Accept"],
            // "Authorization": this.ALLDATA["Authorization"]
        }


        return Axios.post(url, payload, {
            headers: headers
        }).then((response) => {

            console.log(response.data)
            this.std_account_infomation = response.data


            var that = this;
            // 繼續 promise 的 chain
            return new Promise(function (resolve, reject) {
                return resolve(that)
            })

        })
    }


    getCourseSchedule(year, smtr) {
        var url = "https://portal.yzu.edu.tw/AcademicWebAPI/api/Cos/Get_Course_Schedule"

        var payload = new URLSearchParams()
        payload.append("token", this.ALLDATA["Token"])
        payload.append("year", year)
        payload.append("smtr", smtr)
        payload.append("ShowLang", "zh")

        var headers = {
            "Accept": this.ALLDATA["Accept"],
        }

        return Axios.post(url, payload, { headers: headers }).then((response) => {
            console.log(response.data)

            var that = this;
            // 繼續 promise 的 chain
            return new Promise(function (resolve, reject) {
                return resolve(that)
            })

        })
    }


    getNotifyList() {
        var url = "https://portalx.yzu.edu.tw/NewPortal/api/FCM/NotifyList"

        var payload = new URLSearchParams()
        payload.append("Token", this.ALLDATA["Token"])
        payload.append("FCMToken", "")

        var headers = {
            "Accept": this.ALLDATA["Accept"],
        }

        return Axios.post(url, payload, { headers: headers }).then((response) => {
            console.log("Notify: ", response.data)
            this.notify_list = []
            var length_to_truncate = 20;
            // 針對 notify item 做處理
            response.data.forEach(element => {
                // 截短 Title
                if (element.Title.length > length_to_truncate) {
                    element.Title = element.Title.substring(0, length_to_truncate) + "...";
                } else {
                    element.Title = element.Title;
                }

                // 使用 moment 轉換格式
                element.SendDate = moment(element.SendDate).format('YYYY/MM/DD');
                this.notify_list.push(element);
            });

            // this.notify_list = response.data;
            /**
             * Title
             * Body
             * ETitle
             * EBody
             * 
             * NotifyType
             * PostID
             * SendDate
             */

            var that = this;
            // 繼續 promise 的 chain
            return new Promise(function (resolve, reject) {
                return resolve(that)
            })

        })
    }


    /**
     * 得到某一學年某學期修的課程列表
     * @param {string} year 學年，ex: 108, 107
     * @param {string} smtr 學期，ex: 1, 2
     */
    getCourseListFromYZUApi(year, smtr) {
        console.log("Calling: " + this.portalOpenAPIurl + this.portalOpenAPI["CosList"]);

        var url = this.portalOpenAPIurl + "/api/Open/CosList?year=" + year + "&smtr=" + smtr

        return new Promise(function (resolve, reject) {
            request.get(url, function (err, response, body) {
                if (!err && response.statusCode == 200) {
                    var dept_list = []; // 所有科系名稱

                    var data = JSON.parse(body)
                    data.forEach(function(datum, index, theArray) {
                        dept_list.indexOf(datum["dept_name"]) === -1 ? dept_list.push(datum["dept_name"].trim()): "";
                        theArray[index].smtr = datum["smtr"].trim();

                        
                        var times = datum["WeekandRoom"].split(",")
                        var r = RegExp("([0-9]{3})\(([0-9a-zA-Z]*)\)", "g");

                        var datumTime = [];

                        times.forEach((time)=>{
                            if(time==""){
                                return;
                            }
                    
                            var info = time.match(r);
                            
                            if(info==null){
                                datum["time"] = "無課程資料";
                                datum["room"] = "無課程資料";
                            }else if(info.length==1){
                                datum["time"] = info[0];
                                datum["room"] = "無教室位置";
                                datumTime.push(info[0])
                            }else{
                                datum["time"] = info[0];
                                datum["room"] = info[1];
                                datumTime.push(info[0])
                            }
                        })
                        
                        if(datumTime.length > 0){
                            datum["time"] = datumTime.join(",")
                        }


                        theArray[index].hashid = crypto.createHash('md5').update(JSON.stringify(datum)).digest('hex');
                    });

                    return resolve({
                        course_list: data,
                        dept_list: dept_list
                    })
                }
            })
        })
    }

}





module.exports = { BackendService };