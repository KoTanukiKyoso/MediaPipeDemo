// 「N-DEV」により作成されました。
// import {type Auth, getAuth, onAuthStateChanged} from "firebase/auth";

export const useStore = () => {
    let title: Ref<string> = useState('title', () => "サンプルアプリ");//NOTE:アプリタイトル
    let messages: Ref<any[]> = useState('messages', () => []);
    let firebaseUserData: Ref<Dictionary | null> = useState('firebaseUserData', () => null);
    let isSignedIn: Ref<boolean> = useState('isSignedIn', () => false);// ログイン中はTrue
    let isSignedUp: Ref<boolean> = useState('isSignedUp', (): boolean => false);// 新規登録時にTrue
    let gotUserData: Ref<boolean> = useState('gotUserData', () => false);
    let endFirstAuth: Ref<boolean> = useState('endFirstAuth', () => false);
    let first: Ref<boolean> = useState('first', () => true);
    const resetAuth = () => {
        console.log("resetAuth");
        firebaseUserData.value = null;
        isSignedIn.value = false;
        gotUserData.value = false;
    };
    const addMessage = (message: any) => {
        if (!message.dismissible) message.dismissible = false;
        if (!message.time) message.time = 4;
        if (message.risk !== 0 && !message.risk) message.risk = 3;
        messages.value.push(message);
    };
    const onAuthStateChanged = (_user: any) => {
        if (!_user) {
            firebaseUserData.value = null;
            endFirstAuth.value = true;
            return;
        }
        if (!firebaseUserData.value) firebaseUserData.value = {};
        let __user = {...firebaseUserData.value};
        for (let k in _user) __user[k] = _user[k]; //firebaseが返したユーザー情報をマージ
        firebaseUserData.value = __user;
        endFirstAuth.value = true;
    };
    /**
     * Eメール確認済みならtrueを返す
     */
    const emailVerified = () => true;
    return {
        title,
        messages,
        firebaseUserData,
        isSignedIn,
        isSignedUp,
        gotUserData,
        endFirstAuth,
        first,

        pages: [
            {
                "title": "手認識Demo",
                "to": "/hand",
                "description": "",
                "icon": "mdi-hand-back-right-outline",
                "conds": {
                    "signedIn": false,
                    "appMenu": true
                }
            },
            {
                "title": "顔認識Demo",
                "to": "/face",
                "description": "",
                "icon": "mdi-face-recognition",
                "conds": {
                    "signedIn": false,
                    "appMenu": true
                }
            },
        ],

        resetAuth,
        onAuthStateChanged,
        addMessage,
        emailVerified,
    };
};
export const useTasks = (): Ref<number> => useState('tasks', () => 0);

export const useFirebaseAuth = () => {
    let {gotUserData, resetAuth, addMessage, onAuthStateChanged, isSignedIn, isSignedUp} = useStore();
    // const auth: Auth = getAuth();
    // let tasks = useTasks();
    // let timer: any = useState("timer", () => null);
    // let token: any = useState("token", () => null);
    // let authed = useState("authed", () => false);
    const getUserData = async (__user: any) => {
        // if(isSignedUp.value) return;
        onAuthStateChanged({
            name: "nexs",
            email: "sample@smail.com",
            image: null,
            token: "sample_token",
        });
        gotUserData.value = true;
        isSignedUp.value = false;
    };
    const logout = () => {
        isSignedUp.value = false;
        addMessage({
            text: `ログアウトしました。`,
            risk: 0
        });
        resetAuth();
    };
    // if (!authed.value) { //NOTE: ユーザ認証例
    //     authed.value = true;
    //     onAuthStateChanged(auth, (user) => {
    //         console.log("onAuthStateChanged");
    //         if (!endFirstAuth.value) tasks.value--;
    //         if (user && user.uid) {
    //             user.getIdToken(true).then(async function (idToken) {
    //                 if (timer.value) {
    //                     clearInterval(timer.value);
    //                     timer.value = null;
    //                 }
    //                 timer.value = setInterval(() => {
    //                     user.getIdToken(true).then(function (idToken) {
    //                         changeAuthState({
    //                             token: idToken
    //                         });
    //                         token.value = idToken;
    //                         console.log("firebase トークン更新");
    //                     }).catch(function (error) {
    //                         console.log("firebase トークンの更新エラー:" + error);
    //                     });
    //                 }, 1000 * 60 * 30);
    //                 changeAuthState({
    //                     providerData: user.providerData,
    //                     uid: user.uid,
    //                     displayName: user.displayName,
    //                     name: user.displayName,
    //                     email: user.email,
    //                     photoURL: user.photoURL,
    //                     emailVerified: user.emailVerified,
    //                     token: idToken
    //                 });
    //                 isSignedIn.value = true;
    //                 token.value = idToken;
    //                 //ユーザデータ書き込み 取得
    //                 await getUserData(user);
    //                 console.log("firebase トークン更新");
    //             }).catch(function (error) {
    //                 console.log("firebase トークンの更新エラー:" + error);
    //             });
    //         } else {
    //             changeAuthState(null);
    //             resetAuth();
    //             navigateTo("/login");
    //         }
    //     });
    // }

    //NOTE: サンプルでは認証無しでログイン状態にしています
    onAuthStateChanged({
        name: "nexs",
        email: "sample@smail.com",
        image: null,
        token: "sample_token",
    });
    isSignedIn.value = true;

    return {
        logout,
        getUserData,
    };
};

export class GettingConditions {
    [index: string]: any;

    count: number = 0;
    limit: number = 40;
    pageLength: number = 1;
    page: number = 1;
    words: string = "";

    constructor(item: any = null) {
        if (!item) return;
        for (let k in item) {
            this[k] = item[k];
        }
    }
}
