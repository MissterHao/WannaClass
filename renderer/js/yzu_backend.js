const request = require("request")
const { default: Axios } = require("axios")
const NodeRSA = require('node-rsa');


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
        }


        
        this.sid = sid;
        this.spwd = spwd;

        this._setSidSpwd(sid, spwd)



    }

    loginService(sid, spwd) {
        this._setSidSpwd(sid, spwd)

        console.log(this.sid, this.spwd);


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

            this.student_infomation = response.data;
            console.log(response.data)

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

}





module.exports = { BackendService };