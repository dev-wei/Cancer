angular.module('UserChat.System').factory("Global", [
    function () {
        return {
            user: window.user,
            authenticated: !!window.user
        };
    }
]);