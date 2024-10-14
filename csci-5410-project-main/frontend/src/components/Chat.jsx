import React, { Component } from "react";
import Kommunicate from "@kommunicate/kommunicate-chatbot-plugin";

class KommunicateChat extends Component {
    componentDidMount() {
        if (!document.getElementById("kommunicate-script")) {
            const userId = localStorage.getItem("userId");
            console.log(userId);
            (function (d, m) {
                var kommunicateSettings = {
                    "userId": userId,
                    appId: "51a84231d95b2cb2c085282a6acbbc38",
                    popupWidget: true,
                    onInit: function () {
                        var chatContext = {
                            metadata: {
                                userId: userId
                            }
                        };
                        Kommunicate.updateChatContext(chatContext);
                    },
                    automaticChatOpenOnNavigation: true,
                };
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.async = true;
                s.id = "kommunicate-script";
                s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
                var h = document.getElementsByTagName("head")[0];
                h.appendChild(s);
                s.onload = function() {
                    window.kommunicate = m => {
                        m._globals = {...m._globals, ...kommunicateSettings};
                    };
                };
                window.kommunicate = m;
                m._globals = kommunicateSettings;
            })(document, window.kommunicate || {});
        }
    }

    render() {
        return <div></div>;
    }
}

export default KommunicateChat;