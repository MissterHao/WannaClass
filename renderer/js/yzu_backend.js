console.log("YZU Backend loaded!");
export default class BackendService {
    constructor(sid, spwd) {
        this.sid = sid;
        this.spwd = spwd;
    }

    loginService(sid, spwd) {
        this.sid = sid;
        this.spwd = spwd;

        console.log(this.sid, this.spwd);
        return true;
    }
}